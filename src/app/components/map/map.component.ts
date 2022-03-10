import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';
import { Graph } from 'graphlib';
import { featureCollection as tFeatureCollection } from '@turf/helpers';
import { Store, select } from '@ngrx/store';

import { DragBox, Select } from 'ol/interaction';
import olVectorLayer from 'ol/layer/Vector';
import olVectorSource from 'ol/source/Vector';
import { GeoJSON, KML, MVT } from 'ol/format';
import { get as getProjection, METERS_PER_UNIT } from 'ol/proj';
import { click, noModifierKeys } from 'ol/events/condition';
import { applyStyle } from 'ol-mapbox-style';
import { createXYZ } from 'ol/tilegrid';
import greyScale from '../../../assets/vector-tiles/open-map-style.Positron.json';

import { MapOlService } from '@dlr-eoc/map-ol';
import { MapStateService } from '@dlr-eoc/services-map-state';
import { OsmTileLayer } from '@dlr-eoc/base-layers-raster';
import { Layer, LayersService, RasterLayer, CustomLayer, LayerGroup, VectorLayer } from '@dlr-eoc/services-layers';
import { WpsBboxValue } from 'src/app/services/wps';

import { State } from 'src/app/ngrx_register';
import { getMappableProducts, getScenario, getGraph } from 'src/app/riesgos/riesgos.selectors';
import { Product } from 'src/app/riesgos/riesgos.datatypes';
import { InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { LayerMarshaller } from './layer_marshaller';
import { ProductLayer } from './map.types';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';
import { SelectEvent } from 'ol/interaction/Select';
import VectorTileLayer from 'ol/layer/VectorTile';
import { VectorTile } from 'ol/source';
import { createTableHtml } from 'src/app/helpers/others';
import { updateSearchParamsHashRouting } from 'src/app/shared/url.utils';

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
    private subs: Subscription[] = [];

    constructor(
        public mapStateSvc: MapStateService,
        public mapSvc: MapOlService,
        private store: Store<State>,
        private layerMarshaller: LayerMarshaller,
        public layersSvc: LayersService,
        private translator: SimplifiedTranslationService
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

        // listening for focus-change
        const sub2 = this.store.pipe(
            select(getFocussedProcessId),
            withLatestFrom(
                this.store.pipe(select(getGraph)),
                this.layersSvc.getOverlays()
            ),
        ).subscribe(([focussedProcessId, graph, currentOverlays]: [string, Graph, ProductLayer[]]) => {
            if (graph && focussedProcessId !== 'some initial focus') {
                const inEdges = graph.inEdges(focussedProcessId);
                const outEdges = graph.outEdges(focussedProcessId);
                if (inEdges && outEdges) {
                    const inputs = inEdges.map(edge => edge.v);
                    const outputs = outEdges.map(edge => edge.w);
                    for (const layer of currentOverlays) {
                        if (outputs.includes((layer as ProductLayer).productId)) {
                            layer.hasFocus = true;
                        } else {
                            layer.hasFocus = false;
                        }
                        this.shouldLayerExpand(layer);
                        this.layersSvc.updateLayer(layer, 'Overlays');
                    }
                }
            }
        });
        this.subs.push(sub2);

        // listening for products that can be displayed on the map
        const sub3 = this.store.pipe(
            select(getMappableProducts),

            // translate to layers
            switchMap((products: Product[]) => {
                return this.layerMarshaller.productsToLayers(products);
            }),

            withLatestFrom(this.layersSvc.getOverlays()),
            map(([newOverlays, oldOverlays]: [ProductLayer[], ProductLayer[]]) => {

                // keep user's visibility-settings
                for (const oldLayer of oldOverlays) {
                    const newLayer = newOverlays.find(nl => nl.id === oldLayer.id);
                    if (newLayer) {
                        newLayer.visible = oldLayer.visible;
                        newLayer.hasFocus = oldLayer.hasFocus;
                        this.shouldLayerExpand(newLayer);
                    }
                }

                // set hasFocus=true for new layers
                // also expand new layers if they have legendImg or description
                for (const newLayer of newOverlays) {
                    const oldLayer = oldOverlays.find(ol => ol.id === newLayer.id);
                    if (!oldLayer) {
                        newLayer.hasFocus = true;
                        this.shouldLayerExpand(newLayer);
                    }
                }

                return [newOverlays, oldOverlays];
            })


            // add to map
        ).subscribe(([newOverlays, oldOverlays]: [ProductLayer[], ProductLayer[]]) => {
            const add: ProductLayer[] = newOverlays.filter(no => !oldOverlays.map(oo => oo.id).includes(no.id));
            const update: ProductLayer[] = newOverlays.filter(no => oldOverlays.map(oo => oo.id).includes(no.id));
            const remove: ProductLayer[] = oldOverlays.filter(oo => !newOverlays.map(no => no.id).includes(oo.id));
            add.map(ol => this.layersSvc.addLayer(ol, ol.filtertype));
            update.map(ol => this.layersSvc.updateLayer(ol, ol.filtertype));
            remove.map(ol => this.layersSvc.removeLayer(ol, ol.filtertype));
        });
        this.subs.push(sub3);


        // adding drag-box interaction and hooking it into the store
        const dragBox = new DragBox({
            condition: (event) => {
                return this.interactionState$.getValue().mode === 'bbox';
            },
            onBoxEnd: () => {
                const originalProjection = this.interactionState$.getValue().product.value.crs;
                dragBox.getGeometry().transform(mapProjection, originalProjection);
                const lons = dragBox.getGeometry().getCoordinates()[0].map(coords => coords[0]);
                const lats = dragBox.getGeometry().getCoordinates()[0].map(coords => coords[1]);
                const minLon = Math.min(...lons);
                const maxLon = Math.max(...lons);
                const minLat = Math.min(...lats);
                const maxLat = Math.max(...lats);
                const box: WpsBboxValue = {
                    crs: originalProjection,
                    lllat: minLat.toFixed(1) as unknown as number,
                    lllon: minLon.toFixed(1) as unknown as number,
                    urlat: maxLat.toFixed(1) as unknown as number,
                    urlon: maxLon.toFixed(1) as unknown as number
                };
                const product: Product = {
                    ...this.interactionState$.getValue().product,
                    value: box
                };
                this.store.dispatch(new InteractionCompleted({ product }));
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
                    const product = {
                        ...this.interactionState$.getValue().product,
                        value: [newFeatureCollection]
                    };
                    this.store.dispatch(new InteractionCompleted({ product }));
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
        const sub5 = this.store.pipe(select(getScenario)).subscribe((scenario: string) => {
            this.layersSvc.removeLayers();
            const baseLayers$ = this.getBaseLayers(scenario);
            const infoLayers$ = this.getInfoLayers(scenario);

            forkJoin([baseLayers$, infoLayers$]).subscribe((layers) => {
                const baseLayers = layers[0];
                const infoLayers = layers[1];

                for (const layer of baseLayers) {
                    if (layer instanceof LayerGroup) {
                        this.layersSvc.addLayerGroup(layer, 'Layers');
                    } else {
                        this.layersSvc.addLayer(layer, 'Layers', false);
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
    }

    ngAfterViewInit(): void {
        // listening for change in scenario - afterViewInit
        const sub6 = this.store.pipe(select(getScenario)).subscribe((scenario: string) => {
            const p = getProjection(mapProjection);
            this.mapSvc.setProjection(p.getCode());
            const center = this.getCenter(scenario);
            this.mapSvc.setZoom(8);
            this.mapSvc.setCenter(center, true);
        });
        this.subs.push(sub6);
    }

    ngOnDestroy(): void {
        this.subs.map(s => s.unsubscribe());
        this.layersSvc.removeBaseLayers();
        this.layersSvc.removeLayers();
        this.layersSvc.removeOverlays();
    }

    private shouldLayerExpand(layer: ProductLayer) {
      if (layer.hasFocus) {
        if (layer.legendImg || layer.description || layer.dynamicDescription) {
          layer.expanded = true;
        }
      } else {
        layer.expanded = false;
      }
    }

    private getCenter(scenario: string): [number, number] {
        switch (scenario) {
            case 'c1':
            case 'c2':
                return [-70.799, -33.990];
            case 'e1':
                return [-78.4386, -0.6830];
            case 'p1':
                return [-75.902, -11.490];
            default:
                throw new Error(`Unknown scenario: ${scenario}`);
        }
    }

    private getInfoLayers(scenario: string): Observable<(Layer | LayerGroup)[]> {
        const layers: Array<Layer | LayerGroup> = [];

        if (scenario === 'c1') {

            const powerlineLayer = new CustomLayer({
                custom_layer: new olVectorLayer({
                    source: new olVectorSource({
                        url: 'assets/data/geojson/powerlines_chile.geojson',
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
                attribution: '&copy, <a href="http://energiamaps.cne.cl">energiamaps.cne.cl/</a>',
                legendImg: 'http://energiamaps.cne.cl/geoserver/cne-sigcra-new/wms?service=wms&request=GetLegendGraphic&LAYER=sic_20181016234835&FORMAT=image/png',
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
                    new CustomLayer({
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

        if (scenario === 'p1') {

            const peruDistritos = new VectorLayer({
                id: 'peru_distritos',
                name: 'peru_distritos',
                type: 'geojson',
                url: 'assets/data/geojson/peru_distritos.geojson',
                visible: false,
                popup: {
                    popupFunction: (props) => {
                        const keys = [ 'NOMBDIST', 'NOMBPROV', 'NOMBDEP', 'NOM_CAP'];
                        const rows = [];
                        for (const key of keys) {
                            rows.push(['{{ ' + key + ' }}', props[key]]);
                        }
                        return  this.translator.syncTranslate(createTableHtml(rows));
                    }
                },
                attribution: '&copy, <a href="https://www.gob.pe/idep" target="_blank">IDEP</a> & <a href="https://geoservidor.minam.gob.pe/" target="_blank">Geoservidor MINAM</a>',
                description: '<a href="https://www.gob.pe/idep" target="_blank">IDEP</a> & <a href="https://geoservidor.minam.gob.pe/" target="_blank">Geoservidor MINAM</a>',
            });
            const peruDepartamentos = new VectorLayer({
                id: 'peru_departamentos',
                name: 'peru_departamentos',
                type: 'geojson',
                url: 'assets/data/geojson/peru_departamentos.geojson',
                visible: false,
                popup: {
                    popupFunction: (props) => {
                        const keys = ['NOMBDEP'];
                        const rows = [];
                        for (const key of keys) {
                            rows.push(['{{ ' + key + ' }}', props[key]]);
                        }
                        return  this.translator.syncTranslate(createTableHtml(rows));
                    }
                },
                attribution: '&copy, <a href="https://www.gob.pe/idep" target="_blank">IDEP</a> & <a href="https://geoservidor.minam.gob.pe/" target="_blank">Geoservidor MINAM</a>',
                description: '<a href="https://www.gob.pe/idep" target="_blank">IDEP</a> & <a href="https://geoservidor.minam.gob.pe/" target="_blank">Geoservidor MINAM</a>',
            });
            const peruAdministrative = new LayerGroup({
                filtertype: 'Layers',
                id: 'peru_administrative',
                layers: [peruDepartamentos, peruDistritos],
                name: 'peru_administrative',
                expanded: true,
            });
            layers.push(peruAdministrative);
        }

        if (scenario === 'e1') {
            const sniLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'sniLayers',
                name: 'SNI',
                layers: [
                    new CustomLayer({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/geojson/linea_transmision_ecuador.geojson',
                                format: new GeoJSON({
                                    dataProjection: 'EPSG:4326',
                                    featureProjection: this.mapSvc.map.getView().getProjection().getCode()
                                })
                            })
                        }),
                        name: 'Transmission',
                        id: 'transmision',
                        type: 'custom',
                        visible: false,
                        attribution: '&copy, <a href="http://geoportal.regulacionelectrica.gob.ec/visor/index.html">regulacionelectrica.gob.ec</a>',
                        // legendImg: 'assets/layer-preview/citsu-96px.jpg',
                        popup: true
                    }),
                    new CustomLayer({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/geojson/linea_subtransmision_ecuador.geojson',
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
                description: 'SNIDescription'
            });
            layers.push(sniLayers);
        }

        return of(layers);
    }

    private getBaseLayers(scenario: string): Observable<(Layer | LayerGroup)[]> {

        const osmLayer = new OsmTileLayer({
            visible: false,
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

        const geoserviceVTiles = new CustomLayer({
            name: 'OpenMapStyles',
            id: 'planet_eoc_vector_tiles',
            attribution: `© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright"> OpenStreetMap contributors</a>`,
            description: `vtiles_description`,
            type: 'custom',
            visible: true,
            custom_layer: vectorTile
        });

        return of([osmLayer, geoserviceVTiles]);
    }


    subscribeToMapState() {
      const sub7 = this.mapStateSvc.getMapState().subscribe((state) => {
        if (history.pushState) {
          const extent = state.extent.map(item => item.toFixed(3));
          const newurl = updateSearchParamsHashRouting({ bbox: extent.join(',') });
          window.history.pushState({ path: newurl }, '', newurl);
        }
      });
      this.subs.push(sub7);
    }
}
