import { Component, OnInit, ViewEncapsulation, HostBinding, AfterViewInit } from '@angular/core';
import { DragBox, Select } from 'ol/interaction';
import { Style, Stroke } from 'ol/style';
import { singleClick } from 'ol/events/condition';
import { GeoJSON } from 'ol/format';
import { get as getProjection } from 'ol/proj.js';
import { MapStateService } from '@ukis/services-map-state';
import { osm } from '@ukis/base-layers-raster';
import { MapOlService } from '@ukis/map-ol';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getMapableProducts, getScenario } from 'src/app/wps/wps.selectors';
import { Product } from 'src/app/wps/wps.datatypes';
import { HttpClient } from '@angular/common/http';
import { InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { LayerMarshaller } from './layer_marshaller';
import { Layer, LayersService, RasterLayer } from '@ukis/services-layers';

@Component({

    selector: 'ukis-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None, // <-- required so that we can overwrite the #map style to "width:unset;" (otherwise map distorted when moving from scenarios to map)
})
export class MapComponent implements OnInit, AfterViewInit {


    controls: { attribution?: boolean, scaleLine?: boolean, zoom?: boolean, crosshair?: boolean };
    private geoJson = new GeoJSON();
    private interactionState: BehaviorSubject<InteractionState>
    private currentLayers: Observable<Layer[]>; 

    constructor(
        public mapStateSvc: MapStateService,
        public mapSvc: MapOlService,
        private store: Store<State>,
        private layerMarshaller: LayerMarshaller,
        public layersSvc: LayersService, 
    ) {

        this.controls = { attribution: true, scaleLine: true };

        this.currentLayers = this.layersSvc.getLayers();

        // listening for interaction modes
        this.interactionState = new BehaviorSubject<InteractionState>(initialInteractionState);
        this.store.pipe(select("interactionState")).subscribe(currentInteractionState => {
            this.interactionState.next(currentInteractionState);
        })

        this.mapSvc.map.on("click", () => {
            this.mapSvc.removeAllPopups();
        });

    }

    ngOnInit() {

        const osmLayer = new osm();
        osmLayer.visible = true;
        this.layersSvc.addLayer(osmLayer, 'Layers');

        const powerlineLayer = new RasterLayer({
            id: "powerlines",
            name: "Powerlines",
            type: "wms",
            url: "http://sig.minenergia.cl/geoserver/men/wms?",
            params: {
                "LAYERS": "men:lt_sic_728861dd_ef2a_4159_bac9_f5012a351115"
            },
            visible: false
        });
        this.layersSvc.addLayer(powerlineLayer, "Layers");

        const relief = new RasterLayer({
            id: "shade",
            name: "Hillshade",
            type: "wms",
            url: "https://ows.terrestris.de/osm/service?",
            params: {
                "LAYERS": "SRTM30-Hillshade",
                "TRANSPARENT": true,
                "FORMAT": "image/png"
            },
            opacity: 0.3,
            visible: false
        });
        this.layersSvc.addLayer(relief, "Layers");


        // adding dragbox interaction and hooking it into the store
        const dragBox = new DragBox({
            condition: (event) => { 
                return this.interactionState.getValue().mode == "bbox";
            },
            onBoxEnd: () => {
                const coords = dragBox.getGeometry().flatCoordinates
                const box = [coords[0], coords[5], coords[4], coords[1]];
                const product: Product = {
                    ...this.interactionState.getValue().product, 
                    value: box
                };
                this.store.dispatch(new InteractionCompleted({product: product}))
            },
            style: new Style({
                stroke: new Stroke({
                    color: [0, 0, 255, 1]
                })
            })
        });
        this.mapSvc.map.addInteraction(dragBox);


        // adding featureselect interaction and hooking it into the store
        const featureSelect = new Select({
            condition: (event) => {
                return event.type == "pointerdown" && this.interactionState.getValue().mode == "featureselection"
            }
        })
        let selectedFeatures = featureSelect.getFeatures();
        selectedFeatures.on('add', (event) => {
            const feature = event.target.item(0);
            const product = {
                ...this.interactionState.getValue().product, 
                value: this.geoJson.writeFeatureObject(feature)
            };
            this.store.dispatch(new InteractionCompleted({product: product}))
          });
        this.mapSvc.map.addInteraction(featureSelect);




        this.store.pipe(
            select(getMapableProducts)
         ).subscribe((products: Product[]) => {
             this.layersSvc.removeOverlays();
             for (let product of products) {
                this.layerMarshaller.toLayers(product).subscribe(layers => {
                    for(let layer of layers) {
                        this.layersSvc.addLayer(layer, "Overlays")
                    }
                });
            }
        });
    }

    ngAfterViewInit() {
        this.store.pipe(select(getScenario)).subscribe((scenario: string) => {
            switch(scenario) {
                case "c1":
                    this.mapSvc.setCenter([-70.799, -33.990]);
                    break;
                case "e1": 
                    this.mapSvc.setCenter([-78.442, -0.678]);
                    break;
                case "p1":
                    this.mapSvc.setCenter([-75.902, -11.490]);
                    break;
                default: 
                    throw new Error(`Unknown scenario: ${scenario}`)
                }
                this.mapSvc.setZoom(8);
                this.mapSvc.setProjection(getProjection('EPSG:4326'));
            })
    }


   
}
