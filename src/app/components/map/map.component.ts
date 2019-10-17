import { Component, OnInit, ViewEncapsulation, HostBinding, AfterViewInit, OnDestroy } from '@angular/core';
import { DragBox } from 'ol/interaction';
import { Style, Stroke } from 'ol/style';
import { Vector as olVectorLayer } from 'ol/layer';
import { Vector as olVectorSource } from 'ol/source';
import { GeoJSON, KML } from 'ol/format';
import { get as getProjection, transformExtent } from 'ol/proj';
import { MapStateService } from '@ukis/services-map-state';
import { osm, esri_world_imagery } from '@ukis/base-layers-raster';
import { MapOlService } from '@ukis/map-ol';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getMapableProducts, getScenario, getGraph, getProducts } from 'src/app/wps/wps.selectors';
import { Product } from 'src/app/wps/wps.datatypes';
import { InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { LayerMarshaller } from './layer_marshaller';
import { Layer, LayersService, RasterLayer, CustomLayer, LayerGroup } from '@ukis/services-layers';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { Graph } from 'graphlib';
import { ProductLayer } from './map.types';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import tBbox from '@turf/bbox';
import tBuffer from '@turf/buffer';
import { featureCollection as tFeatureCollection } from '@turf/helpers';
import { parse } from 'url';
import { WpsBboxValue } from 'projects/services-wps/src/lib/wps_datatypes';
import { TranslateService } from '@ngx-translate/core';


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
        public layersSvc: LayersService,
        private translator: TranslateService
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
            if (focussedProcessId !== 'some initial focus') {
                const inputs = graph.inEdges(focussedProcessId).map(edge => edge.v);
                const outputs = graph.outEdges(focussedProcessId).map(edge => edge.w);

                for (const layer of currentOverlays) {
                    if (inputs.includes((layer as ProductLayer).productId) || outputs.includes((layer as ProductLayer).productId)) {
                        layer.opacity = 0.6;
                        layer.visible = true;
                    } else {
                        layer.visible = false;
                    }
                    this.layersSvc.updateLayer(layer, 'Overlays');
                }
            }
        });
        this.subs.push(sub2);

        // listening for products that can be displayed in the map
        const sub3 = this.store.pipe(
            select(getMapableProducts),
            mergeMap((products: Product[]) => {
                console.log('now displaying on map: ', products)
                return this.layerMarshaller.productsToLayers(products);
            })
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
                    crs: 'EPSG:4326',
                    lllat: minLat.toFixed(1) as unknown as number,
                    lllon: minLon.toFixed(1) as unknown as number,
                    urlat: maxLat.toFixed(1) as unknown as number,
                    urlon: maxLon.toFixed(1) as unknown as number
                    // lllat: coords[0][0][1].toFixed(1),
                    // lllon: coords[0][0][0].toFixed(1),
                    // urlat: coords[0][2][1].toFixed(1),
                    // urlon: coords[0][2][0].toFixed(1)
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
            this.mapSvc.setProjection(getProjection('EPSG:4326'));
            const center = this.getCenter(scenario);
            this.mapSvc.setCenter(center, true);
        });
        this.subs.push(sub6);

        this.printAllLayers("all layers after scenario-change");
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
            name: this.translator.instant('Hillshade'),
            type: 'wms',
            url: 'https://ows.terrestris.de/osm/service?',
            params: {
                LAYERS: 'SRTM30-Hillshade',
                TRANSPARENT: true,
                FORMAT: 'image/png'
            },
            bbox: [-180, -56, 180, 60],
            description: this.translator.instant('SRTM30 Hillshade - by terrestris'),
            attribution: '&copy, <a href="http://www.terrestris.de">terrestris</a>',
            legendImg: 'assets/layer-preview/hillshade-96px.jpg',
            opacity: 0.3,
            visible: false
        });
        layers.push(relief);


        if (scenario === 'c1') {

            const powerlineLayer = new RasterLayer({
                id: 'powerlines',
                name: this.translator.instant('Powerlines'),
                type: 'wms',
                url: 'http://sig.minenergia.cl/geoserver/men/wms?',
                params: {
                    LAYERS: 'men:lt_sic_728861dd_ef2a_4159_bac9_f5012a351115'
                },
                description: this.translator.instant('SIC-Übertragungsleitung (Línea de Transmisión SIC)'),
                attribution: '&copy, <a href="http://sig.minenergia.cl">sig.minenergia.cl</a>',
                legendImg: 'http://sig.minenergia.cl/geoserver/men/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=lt_sic_728861dd_ef2a_4159_bac9_f5012a351115',
                opacity: 0.3,
                // bbox: [-92.270, -44.104, -48.017, -24.388],
                visible: false
            });
            layers.push(powerlineLayer);


            const shoaLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'shoaLayers',
                name: this.translator.instant('Tsunami Flood Layers (CITSU)'),
                layers: [
                    new CustomLayer({
                        custom_layer: new olVectorLayer({
                            source: new olVectorSource({
                                url: 'assets/data/kml/citsu_taltal_2da_Ed_2012.kml',
                                format: new KML()
                            })
                        }),
                        name: this.translator.instant('Taltal (SHOA)'),
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
                        name: this.translator.instant('Valparaiso (SHOA)'),
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
