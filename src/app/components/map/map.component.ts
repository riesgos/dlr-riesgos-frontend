import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { DragBox } from 'ol/interaction';
import { Style, Stroke } from 'ol/style';
import { Vector as olVectorLayer } from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import { Vector as olVectorSource } from 'ol/source';
import { GeoJSON, KML } from 'ol/format';
import { get as getProjection } from 'ol/proj';
import {getWidth} from 'ol/extent';
import { MapOlService } from '@ukis/map-ol';
import TileWMS from 'ol/source/TileWMS';
import TileGrid from 'ol/tilegrid/TileGrid';
import { MapStateService } from '@ukis/services-map-state';
import { osm, esri_world_imagery } from '@ukis/base-layers-raster';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getMapableProducts, getScenario, getGraph, getProducts } from 'src/app/wps/wps.selectors';
import { Product } from 'src/app/wps/wps.datatypes';
import { InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { LayerMarshaller } from './layer_marshaller';
import { Layer, LayersService, RasterLayer, CustomLayer, LayerGroup, VectorLayer } from '@ukis/services-layers';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { Graph } from 'graphlib';
import { ProductLayer, ProductRasterLayer, ProductVectorLayer } from './map.types';
import { mergeMap, map, withLatestFrom, switchMap } from 'rxjs/operators';
import { featureCollection as tFeatureCollection } from '@turf/helpers';
import { parse } from 'url';
import { WpsBboxValue } from 'projects/services-wps/src/lib/wps_datatypes';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { FeatureCollection, featureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';


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
    private interactionState: BehaviorSubject<InteractionState>;
    private subs: Subscription[] = [];

    constructor(
        public mapStateSvc: MapStateService,
        public mapSvc: MapOlService,
        private store: Store<State>,
        private layerMarshaller: LayerMarshaller,
        public layersSvc: LayersService
    ) {
        this.controls = { attribution: true, scaleLine: true };
    }


    ngOnInit() {

        this.subscribeToMapState();

        // listening for interaction modes
        this.interactionState = new BehaviorSubject<InteractionState>(initialInteractionState);
        const sub1 = this.store.pipe(select('interactionState')).subscribe(currentInteractionState => {
            this.interactionState.next(currentInteractionState);
        });
        this.subs.push(sub1);

        // listening for focus-change
        const sub2 = this.store.pipe(
            select(getFocussedProcessId),
            withLatestFrom(
                this.store.pipe(select(getGraph)),
                this.layersSvc.getOverlays()
            ),
        ).subscribe(([focussedProcessId, graph, currentOverlays]: [string, Graph, Layer[]]) => {
            if (graph && focussedProcessId !== 'some initial focus') {
                const inEdges = graph.inEdges(focussedProcessId);
                const outEdges = graph.outEdges(focussedProcessId);
                if (inEdges && outEdges) {
                    const inputs = inEdges.map(edge => edge.v);
                    const outputs = outEdges.map(edge => edge.w);
                    for (const layer of currentOverlays) {
                        if (inputs.includes((layer as ProductLayer).productId) || outputs.includes((layer as ProductLayer).productId)) {
                            layer.opacity = 0.6;
                            layer.hasFocus = true;
                        } else {
                            layer.opacity = 0.1;
                            layer.hasFocus = false;
                        }
                        this.layersSvc.updateLayer(layer, 'Overlays');
                    }
                }
            }
        });
        this.subs.push(sub2);

        // listening for products that can be displayed in the map
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

                return newOverlays;
            })


        // add to map
        ).subscribe((newOverlays: ProductLayer[]) => {
            this.layersSvc.removeOverlays();
            newOverlays.map(l => this.layersSvc.addLayer(l, l.filtertype));
        });
        this.subs.push(sub3);


        // adding dragbox interaction and hooking it into the store
        const dragBox = new DragBox({
            condition: (event) => {
                return this.interactionState.getValue().mode === 'bbox';
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
                    ...this.interactionState.getValue().product,
                    value: box
                };
                this.store.dispatch(new InteractionCompleted({ product }));
            },
            style: new Style({
                stroke: new Stroke({
                    color: [0, 0, 255, 1]
                })
            })
        });
        this.mapSvc.map.addInteraction(dragBox);


        // adding featureselect interaction and hooking it into the store
        this.mapSvc.map.on('click', (event) => {
            this.mapSvc.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
                if (this.interactionState.getValue().mode === 'featureselection') {
                    const product = {
                        ...this.interactionState.getValue().product,
                        value: [tFeatureCollection([JSON.parse(this.geoJson.writeFeature(feature))])]
                    };
                    this.store.dispatch(new InteractionCompleted({ product }));
                }
            });
        });

        this.mapSvc.map.on('click', () => {
            this.mapSvc.removeAllPopups();
        });

        // listening for change in scenario - onInit
        const sub5 = this.store.pipe(select(getScenario)).subscribe((scenario: string) => {
            const infolayers = this.getInfoLayers(scenario);
            for (const layer of infolayers) {
                if (layer instanceof LayerGroup) {
                    this.layersSvc.addLayerGroup(layer);
                } else {
                    this.layersSvc.addLayer(layer, 'Layers', false);
                }
            }
        });
        this.subs.push(sub5);
    }

    private printAllLayers(message: string): void {
        const layergroups = this.mapSvc.map.getLayers().getArray();
        console.log(message);
        console.log('1st level: ', layergroups);
        for (const layergroup of layergroups) {
            const title = layergroup.get('title');
            const layers = layergroup.getLayers().getArray();
            console.log(`2nd level: ${title}:`, layers, layers.map(l => l.get('id')));
        }
    }

    ngAfterViewInit() {
        // listening for change in scenario - afterViewInit
        const sub6 = this.store.pipe(select(getScenario)).subscribe((scenario: string) => {
            this.mapSvc.setZoom(8);
            this.mapSvc.setProjection(getProjection(mapProjection));
            const center = this.getCenter(scenario);
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
    private getInfoLayers(scenario: string) {
        const layers: Array<Layer | LayerGroup> = [];

        const osmLayer = new osm();
        osmLayer.visible = true;
        osmLayer.legendImg = 'assets/layer-preview/osm-96px.jpg';
        layers.push(osmLayer);

        const esri_imagery = new esri_world_imagery(<any>{
            legendImg: 'assets/layer-preview/esri-imagery-96px.jpg'
        });
        layers.push(esri_imagery);

        const relief = new RasterLayer({
            id: 'shade',
            name: 'Hillshade',
            type: 'wms',
            url: 'https://ows.terrestris.de/osm/service?',
            params: {
                LAYERS: 'SRTM30-Hillshade',
                TRANSPARENT: true,
                FORMAT: 'image/png'
            },
            bbox: [-180, -56, 180, 60],
            description: 'SRTM30 Hillshade - by terrestris',
            attribution: '&copy, <a href="http://www.terrestris.de">terrestris</a>',
            legendImg: 'assets/layer-preview/hillshade-96px.jpg',
            opacity: 0.3,
            visible: false
        });
        layers.push(relief);


        if (scenario === 'c1') {

            const powerlineLayer = new RasterLayer({
                id: 'powerlines',
                name: 'Powerlines',
                type: 'wms',
                url: 'http://energiamaps.cne.cl/geoserver/cne-sigcra-new/wms?',
                params: {
                    LAYERS: 'sic_20181016234835'
                },
                description: 'Línea de Transmisión SIC',
                attribution: '&copy, <a href="http://energiamaps.cne.cl">energiamaps.cne.cl/</a>',
                legendImg: 'http://energiamaps.cne.cl/geoserver/cne-sigcra-new/wms?service=wms&request=GetLegendGraphic&LAYER=sic_20181016234835&FORMAT=image/png',
                opacity: 0.3,
                // bbox: [-92.270, -44.104, -48.017, -24.388],
                visible: false
            });
            layers.push(powerlineLayer);


            const shoaLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'shoaLayers',
                name: 'Tsunami Flood Layers (CITSU)',
                layers: [
                    new CustomLayer({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/kml/citsu_taltal_2da_Ed_2012.kml',
                                format: new KML()
                            })
                        }),
                        name: 'Taltal (SHOA)',
                        id: 'Taltal_SHOA',
                        type: 'custom',
                        // bbox: [-70.553, -25.472, -70.417, -25.334],
                        visible: false,
                        attribution: '&copy, <a href="http://www.shoa.cl/php/citsu.php">shoa.cl</a>',
                        legendImg: 'assets/layer-preview/citsu-96px.jpg',
                        popup: true
                    }),
                    new CustomLayer({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/kml/citsu_valparaiso_vinna.kml',
                                format: new KML()
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

            // To make the IDEP-layers display labels in the same way as on ...
            // http://mapas.geoidep.gob.pe/mapasperu/?config=viewer_wms&wmsuri=http://sigr.regioncajamarca.gob.pe:6080/arcgis/rest/services/Map/Informacion_Base/MapServer&wmstitle=Informaci%C3%B3n%20Base&t=1
            // ... we need to adjust the wms-tilegrid.
            const tileWidth = 1920;
            const tileHeight = 948;
            const view = this.mapSvc.map.getView();
            const startZoom = view.getMinZoom();
            const endZoom = view.getMaxZoom();
            const resolutions = new Array(endZoom + 1);
            const projExtent = getProjection(mapProjection).getExtent();
            const startResolution = getWidth(projExtent) / tileWidth;
            for (let z = startZoom; z <= endZoom; z++) {
                resolutions[z] = startResolution / Math.pow(2, z); // view.getResolutionForZoom(z);
            }

            const idepTileGrid = new TileGrid({
                extent: [-86, -21, -68, 1],
                resolutions,
                tileSize: [tileWidth, tileHeight]
            });

            const idepLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'idepLayers',
                name: 'Infraestructura de datos geoespeciales fundamentales',
                layers: [
                    new CustomLayer({
                        custom_layer: new TileLayer({
                            source: new TileWMS({
                                url: 'http://mapas.geoidep.gob.pe/geoidep/services/Demarcacion_Territorial/MapServer/WMSServer?',
                                params: {
                                    layers: '0',
                                    tiled: true
                                },
                                tileGrid: idepTileGrid
                            })
                        }),
                        name: 'Departementos',
                        id: 'departementos_idep',
                        type: 'custom',
                        visible: false,
                        opacity: 0.6,
                        attribution: '&copy, <a href="http://mapas.geoidep.gob.pe/">Instituto Geográfico Nacional</a>',
                        popup: true
                    }),
                    new CustomLayer({
                        custom_layer: new TileLayer({
                            source: new TileWMS({
                                url: 'http://mapas.geoidep.gob.pe/geoidep/services/Demarcacion_Territorial/MapServer/WMSServer?',
                                params: {
                                    layers: '1',
                                    tiled: true
                                },
                                tileGrid: idepTileGrid
                            })
                        }),
                        name: 'Provincias',
                        id: 'provincias_idep',
                        type: 'custom',
                        visible: false,
                        opacity: 0.6,
                        attribution: '&copy, <a href="http://mapas.geoidep.gob.pe/">Instituto Geográfico Nacional</a>',
                        popup: true
                    }),
                    new CustomLayer({
                        custom_layer: new TileLayer({
                            source: new TileWMS({
                                url: 'http://mapas.geoidep.gob.pe/geoidep/services/Demarcacion_Territorial/MapServer/WMSServer?',
                                params: {
                                    layers: '2',
                                    tiled: true
                                },
                                tileGrid: idepTileGrid
                            })
                        }),
                        name: 'Distritos',
                        id: 'distritos_idep',
                        type: 'custom',
                        visible: false,
                        opacity: 0.6,
                        attribution: '&copy, <a href="http://mapas.geoidep.gob.pe/">Instituto Geográfico Nacional</a>',
                        popup: true
                    })
                ]
            });
            layers.push(idepLayers);

        }

        if (scenario === 'e1') {

            const layer = new VectorLayer({
                     id: `vectorTest`,
                     name: `vectorTest`,
                     attribution: '',
                     opacity: 0.6,
                     removable: false,
                     type: 'geojson',
                     filtertype: 'Overlays',
                     data: {
                        "type": "FeatureCollection",
                        "features": [
                          {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                              "type": "Polygon",
                              "coordinates": [
                                [
                                  [
                                    -80.1727294921875,
                                    -1.307259612275665
                                  ],
                                  [
                                    -79.91455078125,
                                    -1.99910598312332
                                  ],
                                  [
                                    -78.59069824218749,
                                    -1.9387168550573113
                                  ],
                                  [
                                    -79.4696044921875,
                                    -0.48888566912309733
                                  ],
                                  [
                                    -80.1727294921875,
                                    -1.307259612275665
                                  ]
                                ]
                              ]
                            }
                          }
                        ]
                      },
                     bbox: [ -84.04541015625, -5.200364681183464, -75.52001953125, 2.3065056838291094 ],
                     options: {
                          style: (feature: olFeature, resolution: number) => {
                             return new olStyle({
                                 image: new olCircle({
                                     radius: 30,
                                     fill: new olFill({
                                         color: 'blue'
                                     }),
                                     stroke: new olStroke({
                                         color: 'white',
                                         witdh: 1
                                     })
                                 })
                             });
                         }
                     },
                     // popup: {
                     //     asyncPupup: (obj, callback) => {
                     //         const html = product.description.vectorLayerAttributes.text(obj);
                     //         callback(html);
                     //     }
                     // },
                     icon: 'lahar',
                     hasFocus: false
                 });
                 
                this.layersSvc.addLayer(layer, 'Overlays', false);
        }

        return layers;
    }


    subscribeToMapState() {
        const sub7 = this.mapStateSvc.getMapState().subscribe((state) => {
            if (history.pushState) {
                const url = parse(window.location.href.replace('#/', ''));
                // console.log(url)
                const query = new URLSearchParams(url.query);
                const extent = state.extent.map(item => item.toFixed(3));
                query.set('bbox', extent.join(','))
                const newurl = `${url.protocol}//${url.host}/#${url.pathname}?${query.toString()}`; // bbox=${extent.join(',') &time=${state.time}
                // console.log(newurl)
                window.history.pushState({ path: newurl }, '', newurl);
            }
        });
        this.subs.push(sub7);
    }
}
