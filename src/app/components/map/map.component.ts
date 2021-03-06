import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, withLatestFrom, switchMap } from 'rxjs/operators';
import { Graph } from 'graphlib';
import { featureCollection as tFeatureCollection } from '@turf/helpers';
import { parse } from 'url';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { DragBox } from 'ol/interaction';
import { Vector as olVectorLayer, Tile as TileLayer } from 'ol/layer';
import { Vector as olVectorSource, TileWMS } from 'ol/source';
import { GeoJSON, KML } from 'ol/format';
import { get as getProjection } from 'ol/proj';
import Feature from 'ol/Feature';
import {click, noModifierKeys} from 'ol/events/condition';
import Select from 'ol/interaction/Select';

import { MapOlService } from '@dlr-eoc/map-ol';
import { MapStateService } from '@dlr-eoc/services-map-state';
import { OsmTileLayer } from '@dlr-eoc/base-layers-raster';
import { Layer, LayersService, RasterLayer, CustomLayer, LayerGroup } from '@dlr-eoc/services-layers';
import { WpsBboxValue } from '@dlr-eoc/utils-ogc';

import { State } from 'src/app/ngrx_register';
import { getMapableProducts, getScenario, getGraph } from 'src/app/riesgos/riesgos.selectors';
import { Product } from 'src/app/riesgos/riesgos.datatypes';
import { InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { WMTSLayerFactory } from './wmts';
import { LayerMarshaller } from './layer_marshaller';
import { ProductLayer } from './map.types';

const mapProjection = 'EPSG:4326';

@Component({
    selector: 'ukis-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {


    controls: { attribution?: boolean, scaleLine?: boolean, zoom?: boolean, crosshair?: boolean };
    private geoJson = new GeoJSON();
    private highlightedFeatures$ = new BehaviorSubject<Feature[]>([]);
    private highlightedFeatures: Feature[] = [];
    private interactionState$ = new BehaviorSubject<InteractionState>(initialInteractionState);
    private subs: Subscription[] = [];

    constructor(
        public mapStateSvc: MapStateService,
        public mapSvc: MapOlService,
        private store: Store<State>,
        private layerMarshaller: LayerMarshaller,
        private wmtsFactory: WMTSLayerFactory,
        public layersSvc: LayersService,
        private translator: TranslateService
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
                        if (inputs.includes((layer as ProductLayer).productId) || outputs.includes((layer as ProductLayer).productId)) {
                            layer.hasFocus = true;
                        } else {
                            layer.hasFocus = false;
                        }
                        this.layersSvc.updateLayer(layer, 'Overlays');
                    }
                }
            }
        });
        this.subs.push(sub2);

        // listening for products that can be displayed on the map
        const sub3 = this.store.pipe(
            select(getMapableProducts),

            // translate to layers
            switchMap((products: Product[]) => {
                return this.layerMarshaller.productsToLayers(products);
            }),

            withLatestFrom(this.layersSvc.getOverlays()),
            map(([newOverlays, oldOverlays]: [ProductLayer[], ProductLayer[]]) => {

                // keep user's visibility-settings
                for (const oldLayer of oldOverlays) {
                    const newLayer = newOverlays.find(nl => nl.id === oldLayer.id );
                    if (newLayer) {
                        newLayer.visible = oldLayer.visible;
                        newLayer.hasFocus = oldLayer.hasFocus;
                    }
                }

                // set hasFocus=true for new layers
                for (const newLayer of newOverlays) {
                    const oldLayer = oldOverlays.find(ol => ol.id === newLayer.id);
                    if (!oldLayer) {
                        newLayer.hasFocus = true;
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


        // adding dragbox interaction and hooking it into the store
        const dragBox = new DragBox({
            condition: (event) => {
                return this.interactionState$.getValue().mode === 'bbox';
            },
            onBoxEnd: () => {
                const lons = dragBox.getGeometry().getCoordinates()[0].map(coords => coords[0]);
                const lats = dragBox.getGeometry().getCoordinates()[0].map(coords => coords[1]);
                const minLon = Math.min(... lons);
                const maxLon = Math.max(... lons);
                const minLat = Math.min(... lats);
                const maxLat = Math.max(... lats);
                const box: WpsBboxValue = {
                    crs: mapProjection,
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
        this.mapSvc.map.addInteraction(dragBox);


        // adding featureselect interaction and hooking it into the store
        const clickInteraction = new Select({
            condition: (mapBrowserEvent) => {
                return click(mapBrowserEvent) && noModifierKeys(mapBrowserEvent);
            },
            style: null // we don't want ol to automatically apply another style on selected items.
        });
        clickInteraction.on('select', (e) => {
                const features = e.target.getFeatures().getArray();
                if (features.length) {
                    if (this.interactionState$.getValue().mode === 'featureselection') {
                        const feature = features[0];
                        const product = {
                            ...this.interactionState$.getValue().product,
                            value: [tFeatureCollection([JSON.parse(this.geoJson.writeFeature(feature))])]
                        };
                        this.store.dispatch(new InteractionCompleted({ product }));
                    } else {
                        this.highlightedFeatures$.next(features);
                        console.log("reacted to click on single feature: changed highlighted")
                    }
                }
        });
        this.mapSvc.map.addInteraction(clickInteraction);


        // // adding multi-featureselect interaction
        // const altClickInteraction = new Select({
        //     condition: (mapBrowserEvent) => {
        //         return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
        //     },
        //     style: false
        // });
        // altClickInteraction.on('select', (e) => {
        //     const features = e.target.getFeatures().getArray();
        //     const highlighted = this.highlightedFeatures;
        //     const allFeatures = Array.prototype.concat(features, highlighted);
        //     this.highlightedFeatures$.next(allFeatures);
        //     console.log("reacted on alt-selection: appended to highlighted")
        // });
        // this.mapSvc.map.addInteraction(altClickInteraction);


        // remove popups when no feature has been clicked
        this.mapSvc.map.on('click', () => {
            if (this.interactionState$.getValue().mode !== 'featureselection') {
                this.mapSvc.removeAllPopups();
                this.highlightedFeatures$.next([]);
                console.log("reacted on click into nothing - removed poups and highlighted")
            }
        });


        // listening for changes in highlighted features
        this.highlightedFeatures$.subscribe((features: Feature[]) => {
            this.highlightedFeatures.map(f => f.set('selected', false));
            features.map(f => f.set('selected', true));
            this.highlightedFeatures = features;
            console.log('new features selected: ', features.length, features);
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
        this.translator.onLangChange.subscribe(lce => {
            this.mapSvc.removeAllPopups();
        });
    }

    ngAfterViewInit() {
        // listening for change in scenario - afterViewInit
        const sub6 = this.store.pipe(select(getScenario)).subscribe((scenario: string) => {
            this.mapSvc.setProjection(getProjection(mapProjection));
            const center = this.getCenter(scenario);
            this.mapSvc.setZoom(8);
            this.mapSvc.setCenter(center, true);
        });
        this.subs.push(sub6);
    }

    ngOnDestroy() {
        this.subs.map(s => s.unsubscribe());
        this.layersSvc.removeBaseLayers();
        this.layersSvc.removeLayers();
        this.layersSvc.removeOverlays();
    }

    private getCenter(scenario: string): [number, number] {
        switch (scenario) {
            case 'c1':
                return [-70.799, -33.990];
            case 'e1':
                return [-78.4386, -0.6830];
            case 'p1':
                return [-75.902, -11.490];
            default:
                throw new Error(`Unknown scenario: ${scenario}`);
        }
    }

    /** TODO add openlayers Drag-and-Drop to add new Additional Layers https://openlayers.org/en/latest/examples/drag-and-drop-image-vector.html */
    private getInfoLayers(scenario: string): Observable<(Layer | LayerGroup)[]> {
        const layers: Array<Layer | LayerGroup> = [];

        if (scenario === 'c1') {

            const powerlineLayer = new CustomLayer({
                custom_layer: new olVectorLayer({
                    source: new olVectorSource({
                        url: 'assets/data/geojson/powerlines_chile.geojson',
                        format: new GeoJSON(),
                        // @ts-ignore
                        crossOrigin: 'anonymous'
                    })
                }),
                name: 'Powerlines',
                id: 'powerlines',
                type: 'custom',
                visible: false,
                popup: true
            });
            layers.push(powerlineLayer);

            const civilServiceLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'CivilServiceLayers',
                name: 'Civil Service',
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
        }

        if (scenario === 'e1') {
            const sniLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'sniLayers',
                name: 'Sistema Nacional de Información',
                layers: [
                    new CustomLayer({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/geojson/linea_transmision_ecuador.geojson',
                                format: new GeoJSON(),
                                crossOrigin: 'anonymous'
                            })
                        }),
                        name: 'transmisión',
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
                                format: new GeoJSON(),
                                crossOrigin: 'anonymous'
                            })
                        }),
                        name: 'subtransmisión',
                        id: 'subtransmision',
                        type: 'custom',
                        visible: false,
                        attribution: '&copy, <a href="http://geoportal.regulacionelectrica.gob.ec/visor/index.html">regulacionelectrica.gob.ec</a>',
                        // legendImg: 'assets/layer-preview/citsu-96px.jpg',
                        popup: true
                    })

                ]
            });
            layers.push(sniLayers);
        }

        return of(layers);
    }

    private getBaseLayers(scenario: string): Observable<(Layer | LayerGroup)[]> {

        return of([new OsmTileLayer({
            visible: true,
            legendImg: 'assets/layer-preview/osm-96px.jpg'
        })]);
        // const lightMap$ = this.wmtsFactory.createWmtsLayer(
        //     'https://tiles.geoservice.dlr.de/service/wmts', 'eoc:litemap', this.mapSvc.EPSG).pipe(
        //         map(l => {
        //             return new CustomLayer({
        //                 custom_layer: l,
        //                 id: 'lightMap',
        //                 name: 'Light map',
        //                 attribution: '&copy, <a href="//geoservice.dlr.de/eoc/basemap/">DLR</a>',
        //                 continuousWorld: false,
        //                 legendImg: 'https://geoservice.dlr.de/eoc/basemap/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=litemap&ATTRIBUTION=&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX=0%2C0%2C10018754.171394622%2C10018754.171394622',
        //                 description: 'http://www.naturalearthdata.com/about/',
        //                 opacity: 1,
        //                 visible: true
        //             });
        //         })
        //     );
        // const blueMarble$ = this.wmtsFactory.createWmtsLayer(
        //     'https://tiles.geoservice.dlr.de/service/wmts', 'bmng_topo_bathy', this.mapSvc.EPSG).pipe(
        //         map(l => {
        //             return new CustomLayer({
        //                 custom_layer: l,
        //                 id: 'blueMarble',
        //                 name: 'Blue marble',
        //                 attribution: '&copy, <a href="//geoservice.dlr.de/eoc/basemap/">DLR</a>',
        //                 continuousWorld: false,
        //                 legendImg: 'https://tiles.geoservice.dlr.de/service/wmts?layer=bmng_topo_bathy&style=_empty&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A3857%3A5&TileCol=18&TileRow=11',
        //                 description: 'Blue Marble NG dataset with topography and bathymetry',
        //                 opacity: 1,
        //                 visible: false
        //             });
        //         })
        //     );
        // const relief$ = this.wmtsFactory.createWmtsLayer(
        //     'https://tiles.geoservice.dlr.de/service/wmts', 'eoc:world_relief_bw', this.mapSvc.EPSG).pipe(
        //         map(l => {
        //             return new CustomLayer({
        //                 custom_layer: l,
        //                 id: 'relief',
        //                 name: 'World relief',
        //                 attribution: '&copy, <a href="//geoservice.dlr.de/eoc/basemap/">DLR</a>',
        //                 continuousWorld: false,
        //                 legendImg: 'https://tiles.geoservice.dlr.de/service/wmts?layer=eoc%3Aworld_relief_bw&style=_empty&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A3857%3A5&TileCol=18&TileRow=11',
        //                 description: 'World Relief Black / White',
        //                 opacity: 1,
        //                 visible: false
        //             });
        //         })
        //     );

        // return forkJoin([lightMap$, blueMarble$, relief$]).pipe(
        //     map((layers: (Layer | LayerGroup)[]) => {

        //             const osmLayer = new OsmTileLayer({
        //                 visible: false,
        //                 legendImg: 'assets/layer-preview/osm-96px.jpg'
        //             });
        //             layers.push(osmLayer);

        //             const gebco = new CustomLayer({
        //                 id: 'gebco',
        //                 name: 'GEBCO',
        //                 custom_layer: new TileLayer({
        //                     source: new TileWMS({
        //                         url: 'https://www.gebco.net/data_and_products/gebco_web_services/2019/mapserv?',
        //                         params: {
        //                             layers: 'GEBCO_2019_Grid',
        //                             tiled: true
        //                         },
        //                         crossOrigin: 'anonymous'
        //                     })
        //                 }),
        //                 visible: false,
        //                 opacity: 1.0,
        //                 legendImg: 'https://www.gebco.net/data_and_products/gebco_web_services/2019/mapserv?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&layers=GEBCO_2019_Grid&tiled=true&WIDTH=128&HEIGHT=128&CRS=EPSG%3A4326&STYLES=&BBOX=-22.5%2C-90%2C0%2C-67.5',
        //                 attribution: '&copy, <a href="https://www.gebco.net/">GEBCO Compilation Group (2020) GEBCO 2020 Grid (doi:10.5285/a29c5465-b138-234d-e053-6c86abc040b9)</a>'
        //             });
        //             layers.push(gebco);
        //             return layers;
        //     }),
        // );
    }


    subscribeToMapState() {
        const sub7 = this.mapStateSvc.getMapState().subscribe((state) => {
            if (history.pushState) {
                const url = parse(window.location.href.replace('#/', ''));
                const query = new URLSearchParams(url.query);
                const extent = state.extent.map(item => item.toFixed(3));
                query.set('bbox', extent.join(','))
                const newurl = `${url.protocol}//${url.host}/#${url.pathname}?${query.toString()}`; // bbox=${extent.join(',') &time=${state.time}
                window.history.pushState({ path: newurl }, '', newurl);
            }
        });
        this.subs.push(sub7);
    }
}
