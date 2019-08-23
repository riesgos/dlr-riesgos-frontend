import { Component, OnInit, ViewEncapsulation, HostBinding, AfterViewInit, OnDestroy } from '@angular/core';
import { DragBox } from 'ol/interaction';
import { Style, Stroke } from 'ol/style';
import { Vector as olVectorLayer } from 'ol/layer';
import { Vector as olVectorSource } from 'ol/source';
import { GeoJSON, KML } from 'ol/format';
import { get as getProjection, transformExtent } from 'ol/proj';
import { MapStateService } from '@ukis/services-map-state';
import { osm } from '@ukis/base-layers-raster';
import { MapOlService } from '@ukis/map-ol';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getMapableProducts, getScenario, getGraph } from 'src/app/wps/wps.selectors';
import { Product } from 'src/app/wps/wps.datatypes';
import { InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { LayerMarshaller } from './layer_marshaller';
import { Layer, LayersService, RasterLayer, CustomLayer, LayerGroup } from '@ukis/services-layers';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { Graph } from 'graphlib';
import { ProductLayer } from './map.types';
import { switchMap } from 'rxjs/operators';
import tBbox from '@turf/bbox'


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
    private graph: BehaviorSubject<Graph>;

    private currentOverlays: ProductLayer[];
    private subs: Subscription[] = [];

    constructor(
        public mapStateSvc: MapStateService,
        public mapSvc: MapOlService,
        private store: Store<State>,
        private layerMarshaller: LayerMarshaller,
        public layersSvc: LayersService,
    ) {
        this.controls = { attribution: true, scaleLine: true };
        this.currentOverlays = [];
    }


    ngOnInit() {
        // listening for interaction modes
        this.interactionState = new BehaviorSubject<InteractionState>(initialInteractionState);
        const sub1 = this.store.pipe(select('interactionState')).subscribe(currentInteractionState => {
            this.interactionState.next(currentInteractionState);
        });
        this.subs.push(sub1);

        // listening for changes in graph
        this.graph = new BehaviorSubject<Graph>(null);
        const sub2 = this.store.pipe(select(getGraph)).subscribe((graph: Graph) => {
            this.graph.next(graph);
        });
        this.subs.push(sub2);

        // listening for focus-change
        const sub3 = this.store.pipe(select(getFocussedProcessId)).subscribe((focussedProcessId: string) => {
            const graph = this.graph.getValue();
            const inputs = graph.inEdges(focussedProcessId).map(edge => edge.v);
            const outputs = graph.outEdges(focussedProcessId).map(edge => edge.w);

            for (const layer of this.currentOverlays) {
                if (inputs.includes(layer.productId) || outputs.includes(layer.productId)) {
                    layer.opacity = 0.9;
                } else {
                    layer.opacity = 0.2;
                }
                this.layersSvc.updateLayer(layer, 'Overlays');
            }
        });
        this.subs.push(sub3);

        // listening for products that can be displayed in the map
        const sub4 = this.store.pipe(
            select(getMapableProducts),
            switchMap((products: Product[]) => {
                return this.layerMarshaller.productsToLayers(products);
            })
        ).subscribe((newOverlays: ProductLayer[]) => {
            this.currentOverlays = newOverlays;
            this.layersSvc.removeOverlays();
            newOverlays.map(l => this.layersSvc.addLayer(l, l.filtertype));
        });
        this.subs.push(sub4);


        // adding dragbox interaction and hooking it into the store
        const dragBox = new DragBox({
            condition: (event) => {
                return this.interactionState.getValue().mode === 'bbox';
            },
            onBoxEnd: () => {
                const coords = dragBox.getGeometry().flatCoordinates;
                const box = [coords[0], coords[5], coords[4], coords[1]];
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
                        value: this.geoJson.writeFeatureObject(feature)
                    };
                    this.store.dispatch(new InteractionCompleted({ product }));
                }
            });
        });

        this.mapSvc.map.on('click', () => {
            this.mapSvc.removeAllPopups();
        });

        const sub5 = this.store.pipe(select(getScenario)).subscribe((scenario: string) => {
            const infolayers = this.getInfoLayers(scenario);
            for (const layer of infolayers) {
                if (layer instanceof LayerGroup) {
                    this.layersSvc.addLayerGroup(layer)
                } else {
                    this.layersSvc.addLayer(layer, 'Layers', false);
                }
            }
        });
        this.subs.push(sub5);
    }


    ngAfterViewInit() {
        // listening for change in scenario
        const sub6 = this.store.pipe(select(getScenario)).subscribe((scenario: string) => {
            this.mapSvc.setZoom(8);
            this.mapSvc.setProjection(getProjection('EPSG:4326'));
            const center = this.getCenter(scenario);
            this.mapSvc.setCenter(center);
        });
        this.subs.push(sub6);
    }

    ngOnDestroy() {
        this.subs.map(s => s.unsubscribe());
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
        osmLayer.legendImg = 'assets/layer-preview/osm-96px.jpg',
            layers.push(osmLayer);

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
                url: 'http://sig.minenergia.cl/geoserver/men/wms?',
                params: {
                    LAYERS: 'men:lt_sic_728861dd_ef2a_4159_bac9_f5012a351115'
                },
                // bbox: [-75.2, -53.1, -65.3, -18.4], not working??
                description: 'SIC-Übertragungsleitung (Línea de Transmisión SIC)',
                legendImg: 'http://sig.minenergia.cl/geoserver/men/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=lt_sic_728861dd_ef2a_4159_bac9_f5012a351115',
                opacity: 0.3,
                visible: false
            });
            layers.push(powerlineLayer);

            const shoaMaps = {
                // 'Taltal (SHOA)': 'assets/data/geojson/citsu_taltal_2da_Ed_2012.json',
                // 'Valparaiso (SHOA)': 'assets/data/geojson/citsu_valparaiso_vinna.json'
                'Taltal (SHOA)': 'assets/data/kml/citsu_taltal_2da_Ed_2012.kml',
                'Valparaiso (SHOA)': 'assets/data/kml/citsu_valparaiso_vinna.kml'
            };
            const shoaLayers = new LayerGroup({
                filtertype: 'Layers',
                id: 'shoaLayers',
                name: 'Tsunami Flood Layers (CITSU)',
                layers: [],
                bbox: [-75.856, -30.586, -65.737, -22.203]
            });

            for (const key in shoaMaps) {
                if (shoaMaps[key]) {
                    const url = shoaMaps[key];
                    const ls = new olVectorSource({
                        url: url,
                        format: new KML() // new GeoJSON() //new KML() //
                    });
                    let _bbox;
                    switch (key) {
                        case 'Taltal (SHOA)':
                            _bbox = [-72.005, -26.275, -69.476, -24.155] // [-70.5212625609999, -25.41627692326784, -70.45375737099988, -25.38161171826857];
                            break;

                        case 'Valparaiso (SHOA)':
                            _bbox = [-75.289, -38.839, -70.230, -35.097] // [-71.65049581099993, -33.04949744513699, -71.5276867199999, -32.93281934213857];
                            break;
                    }
                    const l = new olVectorLayer({
                        source: ls
                    });
                    // console.log(l.getProperties())
                    const layer = new CustomLayer({
                        custom_layer: l,
                        name: key,
                        id: key,
                        type: 'custom',
                        // bbox: _bbox, //TODO bbox not working (layer not displayd)?? but it is working in the demo-maps with custom layer and bbox
                        visible: false,
                        attribution: '',
                        popup: true
                    });

                    /* ls.on('change', (evt) => {
                        console.log(evt.target.getExtent());
                        ls.un('change');
                    }); */

                    shoaLayers.layers.push(layer);
                }
            }
            layers.push(shoaLayers)
        }


        return layers;
    }
}
