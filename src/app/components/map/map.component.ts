import { Component, OnInit, ViewEncapsulation, HostBinding, AfterViewInit } from '@angular/core';
import { DragBox, Select } from 'ol/interaction';
import { Style, Stroke } from 'ol/style';
import { singleClick } from 'ol/events/condition';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { Vector as olVectorLayer } from 'ol/layer';
import { Vector as olVectorSource } from 'ol/source';
import { KML as olKmlFormat, GeoJSON as olGeojsonFormat } from 'ol/format';
import { GeoJSON } from 'ol/format';
import { get as getProjection } from 'ol/proj.js';
import { MapStateService } from '@ukis/services-map-state';
import { osm } from '@ukis/base-layers-raster';
import { MapOlService } from '@ukis/map-ol';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getMapableProducts, getScenario, getGraph } from 'src/app/wps/wps.selectors';
import { Product } from 'src/app/wps/wps.datatypes';
import { HttpClient } from '@angular/common/http';
import { InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { LayerMarshaller } from './layer_marshaller';
import { Layer, LayersService, RasterLayer, CustomLayer } from '@ukis/services-layers';
import { getFocussedProcessId } from 'src/app/focus/focus.selectors';
import { Graph } from 'graphlib';


@Component({

    selector: 'ukis-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit, AfterViewInit {


    controls: { attribution?: boolean, scaleLine?: boolean, zoom?: boolean, crosshair?: boolean };
    private geoJson = new GeoJSON();
    private interactionState: BehaviorSubject<InteractionState>;
    private graph: BehaviorSubject<Graph>;
    private currentLayers: BehaviorSubject<Layer[]>;

    constructor(
        public mapStateSvc: MapStateService,
        public mapSvc: MapOlService,
        private store: Store<State>,
        private layerMarshaller: LayerMarshaller,
        public layersSvc: LayersService,
    ) {
        this.controls = { attribution: true, scaleLine: true };
        this.currentLayers = new BehaviorSubject<Layer[]>([]);
        this.layersSvc.getOverlays().subscribe(layers => this.currentLayers.next(layers));
    }


    ngOnInit() {

        // listening for interaction modes
        this.interactionState = new BehaviorSubject<InteractionState>(initialInteractionState);
        this.store.pipe(select('interactionState')).subscribe(currentInteractionState => {
            this.interactionState.next(currentInteractionState);
        });

        // listening for changes in graph
        this.graph = new BehaviorSubject<Graph>(null);
        this.store.pipe(select(getGraph)).subscribe((graph: Graph) => {
            this.graph.next(graph);
        });

        // listening for focus-change
        this.store.pipe(select(getFocussedProcessId)).subscribe((focussedProcessId: string) => {
            const graph = this.graph.getValue();
            const inputs = graph.inEdges(focussedProcessId).map(edge => edge.v);
            const outputs = graph.outEdges(focussedProcessId).map(edge => edge.w);

            const layers = this.currentLayers.getValue();
            for (const layer of layers) {
                if (inputs.includes(layer.productId) || outputs.includes(layer.productId)) {
                    layer.opacity = 0.9;
                } else {
                    layer.opacity = 0.2;
                }
                this.layersSvc.updateLayer(layer, "Overlays");
            }
        });

        // listening for products that can be displayed in the map
        this.store.pipe(
            select(getMapableProducts)
         ).subscribe((products: Product[]) => {
             this.layersSvc.removeOverlays();
             for (const product of products) {
                this.layerMarshaller.toLayers(product).subscribe(layers => {
                    for (const layer of layers) {
                        this.layersSvc.addLayer(layer, 'Overlays');
                    }
                });
            }
        });

        this.mapSvc.map.on('click', () => {
            this.mapSvc.removeAllPopups();
        });


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
                this.store.dispatch(new InteractionCompleted({product}));
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
                    this.store.dispatch(new InteractionCompleted({product}));
                }
            });
        });

    }

    ngAfterViewInit() {
        // listening gor change in scenario
        this.store.pipe(select(getScenario)).subscribe((scenario: string) => {

            this.mapSvc.setZoom(8);
            this.mapSvc.setProjection(getProjection('EPSG:4326'));

            const center = this.getCenter(scenario);
            this.mapSvc.setCenter(center);

            const infolayers = this.getInfoLayers(scenario);
            for (const layer of infolayers) {
                this.layersSvc.addLayer(layer, 'Layers');
            }
        });
    }

    private getCenter(scenario: string): [number, number] {
        switch (scenario) {
            case 'c1':
                return [-70.799, -33.990];
            case 'e1':
                return [-78.442, -0.678];
            case 'p1':
                return [-75.902, -11.490];
            default:
                throw new Error(`Unknown scenario: ${scenario}`);
        }
    }


   private getInfoLayers(scenario: string): Layer[] {
        const layers: Layer[] = [];

        const osmLayer = new osm();
        osmLayer.visible = true;
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
                visible: false
            });
            layers.push(powerlineLayer);

            const shoaMaps = {
                'Taltal (SHOA)': 'assets/data/geojson/citsu_taltal_2da_Ed_2012.json',
                'Valparaiso (SHOA)': 'assets/data/geojson/citsu_valparaiso_vinna.json'

            };
            for (const key in shoaMaps) {
                if (shoaMaps[key]) {
                    const url = shoaMaps[key];
                    const l = new olVectorLayer({
                        source: new olVectorSource({
                            url: url,
                            format: new olGeojsonFormat()
                        })
                    });
                    const layer = new CustomLayer({
                        custom_layer: l,
                        name: key,
                        id: key,
                        type: 'custom',
                        visible: false
                    });
                    layers.push(layer);
                }
            }
        }


        return layers;
   }
}
