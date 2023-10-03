import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, withLatestFrom, switchMap, filter, bufferCount } from 'rxjs/operators';
import { featureCollection as tFeatureCollection } from '@turf/helpers';
import { Store, select } from '@ngrx/store';

import { MapOlService } from '@dlr-eoc/map-ol';
import { MapStateService } from '@dlr-eoc/services-map-state';
import { OsmTileLayer } from '@dlr-eoc/base-layers-raster';
import { Layer, LayersService, RasterLayer, CustomLayer, LayerGroup } from '@dlr-eoc/services-layers';

import { click, noModifierKeys } from 'ol/events/condition';
import { DragBox, Select } from 'ol/interaction';
import { GeoJSON, KML, MVT } from 'ol/format';
import { get as getProjection } from 'ol/proj';
import { SelectEvent } from 'ol/interaction/Select';
import { TileWMS, VectorTile } from 'ol/source';
import Geometry from 'ol/geom/Geometry';
import olVectorLayer from 'ol/layer/Vector';
import olVectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { applyStyle } from 'ol-mapbox-style';
import { createXYZ } from 'ol/tilegrid';
import greyScale from '../../../assets/vector-tiles/open-map-style.Positron.json';


import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { getCurrentScenarioName, getCurrentScenarioRiesgosState, getProductsWithValOrRef } from 'src/app/riesgos/riesgos.selectors';
import { getSearchParamsHashRouting, updateSearchParamsHashRouting } from 'src/app/helpers/url.utils';
import { interactionCompleted } from 'src/app/interactions/interactions.actions';
import { InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { LayerMarshaller } from './mappable/layer_marshaller';
import { ProductLayer } from './mappable/map.types';
import { initialRiesgosState, RiesgosProduct, RiesgosProductResolved, RiesgosScenarioState, ScenarioName } from 'src/app/riesgos/riesgos.state';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';
import { State } from 'src/app/ngrx_register';
import { AugmenterService } from 'src/app/services/augmenter/augmenter.service';
import { MappableProduct } from './mappable/mappable_products';
import { BboxValue } from '../config_wizard/form-bbox-field/bboxfield/bboxfield.component';


const mapProjection = 'EPSG:3857';

@Component({
    selector: 'ukis-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {


    controls: { attribution?: boolean, scaleLine?: boolean, zoom?: boolean, crosshair?: boolean };
    private geoJson = new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: this.mapSvc.map.getView().getProjection().getCode()
    });
    private interactionState$ = new BehaviorSubject<InteractionState>(initialInteractionState);
    private currentScenario$ = new BehaviorSubject<ScenarioName>(initialRiesgosState.currentScenario);
    private subs: Subscription[] = [];

    constructor(
        public mapStateSvc: MapStateService,
        public mapSvc: MapOlService,
        private store: Store<State>,
        private layerMarshaller: LayerMarshaller,
        public layersSvc: LayersService,
        private translator: SimplifiedTranslationService,
        private router: Router,
        private augmenter: AugmenterService
    ) {
        this.controls = { attribution: true, scaleLine: true };
    }


    ngOnInit() {

        this.subscribeToMapState();

        // listening for interaction modes
        const sub1 = this.store.pipe(select('interactionState')).subscribe(currentInteractionState => {
            this.interactionState$.next(currentInteractionState);
        });
        this.subs.push(sub1);
        // listening for current scenario
        const sub6 = this.store.select(getCurrentScenarioName).subscribe(name => {
            this.currentScenario$.next(name);
        });
        this.subs.push(sub6);

        // listening for focus-change
        const sub2 = this.store.pipe(
            select(getFocussedProcessId),
            withLatestFrom(
                this.layersSvc.getOverlays(),
                this.store.pipe(select(getCurrentScenarioRiesgosState)),
            ),
        ).subscribe(([focussedStepId, currentOverlays, state]: [string, ProductLayer[], RiesgosScenarioState]) => {
            if (focussedStepId && focussedStepId !== 'some initial focus') {
                const focussedStep = state.steps.find(s => s.step.id === focussedStepId).step;
                const inEdges = focussedStep.inputs.map(i => i.id);
                const outEdges = focussedStep.outputs.map(i => i.id);
                if (inEdges && outEdges) {
                    for (const layer of currentOverlays) {
                        if (outEdges.includes((layer as ProductLayer).productId)) {
                            layer.hasFocus = true;
                        } else {
                            layer.hasFocus = false;
                        }
                        this.shouldLayerExpand(layer);
                        this.layersSvc.updateLayer(layer, 'Overlays');
                    }
                }
                // this.mapSvc.removeAllPopups();
            }
        });
        this.subs.push(sub2);

        // listening for products that can be displayed on the map
        const diff$ = this.store.pipe(
            select(getProductsWithValOrRef),
            bufferCount(2, 1),
            map(([oldProducts, newProducts]) => {
                const diff = {
                    toAdd: [],
                    toRemove: [],
                    toUpdate: []
                }

                for (const newProduct of newProducts) {
                    const oldProduct = oldProducts.find(o => o.id === newProduct.id);
                    // Product was already there. Has it changed?
                    if (oldProduct) {
                        if (newProduct.reference && oldProduct.reference && newProduct.reference !== oldProduct.reference) {
                            diff.toUpdate.push(newProduct);
                        } else if (newProduct.value && oldProduct.value && newProduct.value !== oldProduct.value) {
                            diff.toUpdate.push(newProduct);
                        } else if (newProduct.reference && oldProduct.value || newProduct.value && oldProduct.reference) {
                            diff.toUpdate.push(newProduct);
                        }
                    }
                    // Product is new. 
                    else {
                        diff.toAdd.push(newProduct);
                    }
                }
                // Have old products been removed?
                for (const oldProduct of oldProducts) {
                    if (!newProducts.map(n => n.id).includes(oldProduct.id)) {
                        diff.toRemove.push(oldProduct);
                    }
                }
                return diff;
            })
        );

        const addedLayers$ = diff$.pipe(
            map(d => d.toAdd),
            switchMap(products => this.augmenter.loadMapPropertiesForProducts(products)),
            switchMap((products: MappableProduct[]) => this.layerMarshaller.productsToLayers(products)),
            filter(ls => ls.length > 0),
            map(addedLayers => {
                addedLayers.map(l => {
                    l.visible = true;
                    l.hasFocus = true;
                    this.shouldLayerExpand(l);
                })
                return addedLayers;
            })
        );

        const updatedLayers$ = diff$.pipe(
            map(d => d.toUpdate),
            switchMap(products => this.augmenter.loadMapPropertiesForProducts(products)),
            switchMap((products: MappableProduct[]) => this.layerMarshaller.productsToLayers(products)),
            withLatestFrom(this.layersSvc.getOverlays()),
            map(([newLayers, oldLayers]: [ProductLayer[], ProductLayer[]]) => {
                // keep user's visibility-settings
                for (const oldLayer of oldLayers) {
                    const newLayer = newLayers.find(nl => nl.id === oldLayer.id);
                    if (newLayer) {
                        newLayer.visible = oldLayer.visible;
                        newLayer.hasFocus = oldLayer.hasFocus;
                        this.shouldLayerExpand(newLayer);
                    }
                }
                // set hasFocus=true for new layers
                // also expand new layers if they have legendImg or description
                for (const newLayer of newLayers) {
                    const oldLayer = oldLayers.find(ol => ol.id === newLayer.id);
                    if (!oldLayer) {
                        newLayer.hasFocus = true;
                        this.shouldLayerExpand(newLayer);
                    }
                }
                return newLayers;
            }),
            filter(ls => ls.length > 0)
        );

        const removedLayers$ = diff$.pipe(
            map(d => d.toRemove),
            filter(ls => ls.length > 0)
        );

        const sub3 = addedLayers$.subscribe(toAdd => {
            toAdd.map(l => this.layersSvc.addLayer(l, l.filtertype));
        });
        const sub4 = updatedLayers$.subscribe(toUpdate => {
            toUpdate.map(l => this.layersSvc.updateLayer(l, l.filtertype));
        });
        const sub7 = removedLayers$.subscribe(toRemove => {
            const toRemoveIds = toRemove.map(r => r.id);
            this.layersSvc.removeOverlays((layer, index, all) => toRemoveIds.includes((layer as ProductLayer).productId));
        });

        this.subs.push(sub3);
        this.subs.push(sub4);
        this.subs.push(sub7);


        // adding drag-box interaction and hooking it into the store
        const dragBox = new DragBox({
            condition: (event) => {
                return this.interactionState$.getValue().mode === 'bbox';
            },
            onBoxEnd: () => {
                const originalProjection = (this.interactionState$.getValue().product as RiesgosProductResolved).value.crs;
                dragBox.getGeometry().transform(mapProjection, originalProjection);
                const lons = dragBox.getGeometry().getCoordinates()[0].map(coords => coords[0]);
                const lats = dragBox.getGeometry().getCoordinates()[0].map(coords => coords[1]);
                const minLon = Math.min(...lons);
                const maxLon = Math.max(...lons);
                const minLat = Math.min(...lats);
                const maxLat = Math.max(...lats);
                const box: BboxValue = {
                    lllat: minLat.toFixed(1) as unknown as number,
                    lllon: minLon.toFixed(1) as unknown as number,
                    urlat: maxLat.toFixed(1) as unknown as number,
                    urlon: maxLon.toFixed(1) as unknown as number
                };
                const product: RiesgosProduct = {
                    ...this.interactionState$.getValue().product,
                    value: box
                };
                this.store.dispatch(interactionCompleted({ scenario: this.currentScenario$.getValue(), product }));
            }
        });
        this.mapSvc.map.addInteraction(dragBox as any);


        // adding feature-select interaction and hooking it into the store
        const clickInteraction = new Select({
            condition: (mapBrowserEvent) => {
                return click(mapBrowserEvent) && noModifierKeys(mapBrowserEvent);
            },
            layers: (layer) => {
                // we don't want to select base-map-features
                return layer.get('id') !== 'planet_eoc_vector_tiles';
            },
            style: null // we don't want ol to automatically apply another style on selected items.
        });
        clickInteraction.on('select', (e: SelectEvent) => {
            const features = e.selected;
            if (features.length) {
                if (this.interactionState$.getValue().mode === 'featureselection') {
                    const feature = features[0];
                    const newFeatureCollection = tFeatureCollection([JSON.parse(this.geoJson.writeFeature(feature))]);
                    const product: RiesgosProduct = {
                        ...this.interactionState$.getValue().product,
                        value: newFeatureCollection
                    };
                    this.store.dispatch(interactionCompleted({ scenario: this.currentScenario$.getValue(), product }));
                }
            }
        });
        this.mapSvc.map.addInteraction(clickInteraction as any);


        // remove popups when no feature has been clicked
        this.mapSvc.map.on('click', () => {
            if (this.interactionState$.getValue().mode !== 'featureselection') {
                this.mapSvc.removeAllPopups();
            }
        });

        // listening for change in scenario - onInit
        const sub5 = this.store.pipe(select(getCurrentScenarioName)).subscribe((scenario: string) => {
            this.layersSvc.removeLayers();
            const baseLayers$ = this.getBaseLayers(scenario);
            const infoLayers$ = this.getInfoLayers(scenario);

            forkJoin([baseLayers$, infoLayers$]).subscribe((layers) => {
                const baseLayers = layers[0];
                const infoLayers = layers[1];

                for (const layer of baseLayers) {
                    if (layer instanceof LayerGroup) {
                        this.layersSvc.addLayerGroup(layer, 'Baselayers');
                    } else {
                        this.layersSvc.addLayer(layer, 'Baselayers', false);
                    }
                }

                for (const layer of infoLayers) {
                    if (layer instanceof LayerGroup) {
                        this.layersSvc.addLayerGroup(layer, 'Layers');
                    } else {
                        this.layersSvc.addLayer(layer, 'Layers', false);
                    }
                }
            });
        });
        this.subs.push(sub5);

        // closing popups when language changes, to mask the fact that they are not rebuilt dynamically.
        this.translator.getCurrentLang().subscribe((lang) => {
            this.mapSvc.removeAllPopups();
        });

        // change bbox if user alters it
        this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe((e: NavigationStart) => {
            const url = e.url;
            const searchParas = new URLSearchParams(url);
            const bboxString = searchParas.get('bbox');
            if (bboxString) {
                const bbox = bboxString.split(',').map(v => +v);
                this.mapSvc.setExtent(bbox as [number, number, number, number], true);
            }
        });
    }
    

    ngAfterViewInit(): void {
        // These functions can only be called after view init, because map-service is not yet ready before that.
        const p = getProjection(mapProjection);
        this.mapSvc.setProjection(p.getCode());

        const urlParas = getSearchParamsHashRouting();

        const scenarioId = urlParas.query.get('id');
        const bboxString = urlParas.query.get('bbox');

        if (bboxString && bboxString !== '-180.000,-90.000,180.000,90.000') {
            const bbox = urlParas.query.get('bbox').split(',').map(v => +v);
            this.mapSvc.setExtent(bbox as [number, number, number, number], true);
        } else {
            this.mapSvc.setZoom(8);
            const center = this.getCenter(scenarioId);
            this.mapSvc.setCenter(center, true);
        }
    }

    ngOnDestroy(): void {
        this.subs.map(s => s.unsubscribe());
        this.layersSvc.removeBaseLayers();
        this.layersSvc.removeLayers();
        this.layersSvc.removeOverlays();
    }

    subscribeToMapState() {
        const sub7 = this.mapStateSvc.getMapState().subscribe((state) => {
          if (history.pushState) {
            const extent = state.extent.map(item => item.toFixed(3));
            const extentString = extent.join(',');
            // Ukis sets a default extent. Ignore it.
            if (extentString !== '-180.000,-90.000,180.000,90.000') { 
                const newUrl = updateSearchParamsHashRouting({ bbox: extent.join(',') });
                window.history.pushState({ path: newUrl }, '', newUrl);
            }
          }
        });
        this.subs.push(sub7);
      }

    private shouldLayerExpand(layer: ProductLayer) {
      if (layer.hasFocus && layer.visible) {
        if (layer.legendImg || layer.description || layer.dynamicDescription) {
          layer.expanded = true;
        }
      } else {
        layer.expanded = false;
      }
    }

    private getCenter(scenario: string): [number, number] {
        switch (scenario) {
            case 'Chile':
                return [-70.799, -33.990];
            case 'Ecuador':
                return [-78.4386, -0.6830];
            case 'Peru':
                return [-75.902, -11.490];
            default:
                throw new Error(`Unknown scenario: ${scenario}`);
        }
    }

    private getInfoLayers(scenario: string): Observable<(Layer | LayerGroup)[]> {
        const layers: Array<Layer | LayerGroup> = [];

        if (scenario === 'Chile') {

            const powerlineLayer = new CustomLayer({
                custom_layer: new olVectorLayer({
                    source: new olVectorSource({
                        url: 'assets/data/geojson/chile_power/powerlines_chile.geojson',
                        format: new GeoJSON({
                            dataProjection: 'EPSG:4326',
                            featureProjection: this.mapSvc.map.getView().getProjection().getCode()
                        })
                    })
                }),
                name: 'Powerlines',
                id: 'powerlines',
                type: 'custom',
                visible: false,
                popup: true,
                description: 'PowerlinesDescription',
                attribution: '&copy, <a href="https://energiamaps.cne.cl">energiamaps.cne.cl/</a>',
                legendImg: 'https://energiamaps.cne.cl/geoserver/cne-sigcra-new/wms?service=wms&request=GetLegendGraphic&LAYER=sic_20181016234835&FORMAT=image/png',
            });
            layers.push(powerlineLayer);

            const civilServiceLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'CivilServiceLayers',
                name: 'CivilService',
                description: 'GeoportalChileDescription',
                layers: [
                    new RasterLayer({
                        id: 'police',
                        name: 'Police',
                        type: 'wms',
                        url: 'http://www.geoportal.cl/arcgis/services/MinisteriodeInterior/chile_minterior_carabineros_cuarteles/MapServer/WMSServer?',
                        visible: false,
                        attribution: '&copy, <a href="http://www.geoportal.cl">Ministerio del Interior</a>',
                        legendImg: 'http://www.geoportal.cl/arcgis/services/MinisteriodeInterior/chile_minterior_carabineros_cuarteles/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0',
                        params: {
                            LAYERS: '0'
                        }
                    }),
                    new RasterLayer({
                        id: 'firefighters',
                        name: 'Firefighters',
                        type: 'wms',
                        url: 'http://www.geoportal.cl/arcgis/services/Otros/chile_bomberos_cuerpos/MapServer/WMSServer?',
                        visible: false,
                        attribution: '&copy, <a href="http://www.geoportal.cl">Ministerio del Interior</a>',
                        legendImg: 'http://www.geoportal.cl/arcgis/services/Otros/chile_bomberos_cuerpos/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0',
                        params: {
                            LAYERS: '0'
                        }
                    }),
                    new RasterLayer({
                        id: 'airports',
                        name: 'Airports',
                        type: 'wms',
                        url: 'http://www.geoportal.cl/arcgis/services/MinisteriodeObrasPublicas/chile_mop_infraestructura_aerea/MapServer/WMSServer?',
                        visible: false,
                        attribution: '&copy, <a href="http://www.geoportal.cl">Ministerio del Interior</a>',
                        legendImg: 'http://www.geoportal.cl/arcgis/services/MinisteriodeObrasPublicas/chile_mop_infraestructura_aerea/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0',
                        params: {
                            LAYERS: '0'
                        }
                    })
                ],
                bbox: [-76.202, -33.397, -67.490, -24.899]
            });
            layers.push(civilServiceLayers);

            const shoaLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'shoaLayers',
                name: 'Tsunami Flood Layers (CITSU)',
                description: 'CITSU_description',
                layers: [
                    new CustomLayer<olVectorLayer<olVectorSource<any>>>({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/kml/citsu_valparaiso_vinna.kml',
                                format: new KML(),
                                // @ts-ignore
                                crossOrigin: 'anonymous'
                            })
                        }),
                        name: 'Valparaiso (SHOA)',
                        id: 'Valparaiso_SHOA',
                        type: 'custom',
                        // bbox: [-71.949, -33.230, -71.257, -32.720],
                        visible: false,
                        attribution: '&copy, <a href="http://www.shoa.cl/php/citsu.php">shoa.cl</a>',
                        legendImg: 'assets/layer-preview/citsu-96px.jpg',
                        popup: true
                    })

                ],
                bbox: [-76.202, -33.397, -67.490, -24.899]
            });
            layers.push(shoaLayers);
        }

        if (scenario === 'Peru') {


            const distributionLines = new CustomLayer<TileLayer<TileWMS>>({
                custom_layer: new TileLayer({
                    source: new TileWMS({
                        projection: 'EPSG:4326',
                        attributions: 'https://gisem.osinergmin.gob.pe/',
                        attributionsCollapsible: true,
                        url: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WMSServer',
                        params: {
                            layers: '12'
                        },
                    })
                }),
                id: 'peru_distributionLines',
                name: 'distribution_lines',
                legendImg: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WmsServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=12&'
            });
            const substations = new CustomLayer<TileLayer<TileWMS>>({
                custom_layer: new TileLayer({
                    source: new TileWMS({
                        projection: 'EPSG:4326',
                        attributions: 'https://gisem.osinergmin.gob.pe/',
                        attributionsCollapsible: true,
                        url: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WMSServer',
                        params: {
                            layers: '16'
                        },
                    })
                }),
                id: 'peru_substations',
                name: 'substations',
                legendImg: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WmsServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=16&'
            });
            const nonConventional = new CustomLayer<TileLayer<TileWMS>>({
                custom_layer: new TileLayer({
                    source: new TileWMS({
                        projection: 'EPSG:4326',
                        attributions: 'https://gisem.osinergmin.gob.pe/',
                        attributionsCollapsible: true,
                        url: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WMSServer',
                        params: {
                            layers: '25'
                        },
                    })
                }),
                id: 'peru_nonConventional',
                name: 'generation_nonConventional',
                legendImg: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WmsServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=25&'
            });
            const conventional = new CustomLayer<TileLayer<TileWMS>>({
                custom_layer: new TileLayer({
                    source: new TileWMS({
                        projection: 'EPSG:4326',
                        attributions: 'https://gisem.osinergmin.gob.pe/',
                        attributionsCollapsible: true,
                        url: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WMSServer',
                        params: {
                            layers: '33'
                        },
                    })
                }),
                id: 'peru_conventional',
                name: 'generation_conventional',
                legendImg: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WmsServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=33&'
            });
            const transmission = new CustomLayer<TileLayer<TileWMS>>({
                custom_layer: new TileLayer({
                    source: new TileWMS({
                        projection: 'EPSG:4326',
                        attributions: 'https://gisem.osinergmin.gob.pe/',
                        attributionsCollapsible: true,
                        url: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WMSServer',
                        params: {
                            layers: '19'
                        },
                    })
                }),
                id: 'peru_transmission',
                name: 'Powerlines',
                legendImg: 'https://gisem.osinergmin.gob.pe/serverosih/services/Electricidad/ELECTRICIDAD/MapServer/WmsServer?request=GetLegendGraphic&version=1.3.0&format=image/png&layer=19&'
            });
            const energyGroup = new LayerGroup({
                filtertype: 'Layers',
                id: 'peru_energy',
                name: 'peru_energy',
                layers: [distributionLines, substations, nonConventional, conventional, transmission],
                expanded: true,
                visible: false
            });
            // layers.push(energyGroup);

            // const 
            const waterGroup = new LayerGroup({
                id: 'peru_water',
                name: 'peru_water',
                filtertype: 'Layers',
                layers: [],
                expanded: true,
                visible: false
            });
            layers.push(waterGroup);

        }

        if (scenario === 'Ecuador') {


            const sniLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'sniLayers',
                name: 'SNI',
                layers: [
                    new CustomLayer<olVectorLayer<olVectorSource<Geometry>>>({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/geojson/ecuador_energy/linea_transmision_ecuador.geojson',
                                format: new GeoJSON({
                                    dataProjection: 'EPSG:4326',
                                    featureProjection: this.mapSvc.map.getView().getProjection().getCode()
                                })
                            })
                        }),
                        name: 'Powerlines',
                        id: 'transmision',
                        type: 'custom',
                        visible: false,
                        attribution: '&copy, <a href="http://geoportal.regulacionelectrica.gob.ec/visor/index.html">regulacionelectrica.gob.ec</a>',
                        // legendImg: 'assets/layer-preview/citsu-96px.jpg',
                        popup: true
                    }),
                    new CustomLayer<olVectorLayer<olVectorSource<Geometry>>>({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/geojson/ecuador_energy/linea_subtransmision_ecuador.geojson',
                                format: new GeoJSON({
                                    dataProjection: 'EPSG:4326',
                                    featureProjection: this.mapSvc.map.getView().getProjection().getCode()
                                }),
                            })
                        }),
                        name: 'Subtransmission',
                        id: 'subtransmision',
                        type: 'custom',
                        visible: false,
                        attribution: '&copy, <a href="http://geoportal.regulacionelectrica.gob.ec/visor/index.html">regulacionelectrica.gob.ec</a>',
                        // legendImg: 'assets/layer-preview/citsu-96px.jpg',
                        popup: true
                    })
                ],
                description: 'SNIDescription',
                expanded: true
            });
            layers.push(sniLayers);
        }

        return of(layers);
    }

    private getBaseLayers(scenario: string): Observable<(Layer | LayerGroup)[]> {

        const osmLayer = new OsmTileLayer({
            visible: true,
            legendImg: 'assets/layer-preview/osm-96px.jpg'
        });

        const vectorTile = new VectorTileLayer({
            declutter: true,
            source: new VectorTile({
                format: new MVT(),
                tileGrid: createXYZ({
                    minZoom: 0,
                    maxZoom: 12
                }),
                url: 'https://{a-d}.tiles.geoservice.dlr.de/service/tms/1.0.0/planet_eoc@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf?flipy=true'
            }),
            renderMode: 'hybrid'
        });
        applyStyle(vectorTile, greyScale, 'planet0-12');

        const geoserviceVTiles = new CustomLayer<VectorTileLayer>({
            name: 'OpenMapStyles',
            id: 'planet_eoc_vector_tiles',
            attribution: `© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright"> OpenStreetMap contributors</a>`,
            description: `vtiles_description`,
            type: 'custom',
            visible: false,
            custom_layer: vectorTile
        });

        return of([osmLayer, geoserviceVTiles]);
    }

}
