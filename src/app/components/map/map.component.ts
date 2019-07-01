import { Component, OnInit, ViewEncapsulation, HostBinding, AfterViewInit } from '@angular/core';
import { DragBox } from 'ol/interaction';
import { Style, Stroke } from 'ol/style';
import { get as getProjection } from 'ol/proj.js';
import { LayersService, RasterLayer, VectorLayer } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { osm } from '@ukis/base-layers-raster';
import { MapOlService } from '@ukis/map-ol';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getMaplikeProducts } from 'src/app/wps/wps.selectors';
import { Product } from 'src/app/wps/wps.datatypes';
import { HttpClient } from '@angular/common/http';
import { VectorLayerData, isVectorLayerData, isWmsData, WmsData, isBboxLayerData, BboxLayerData } from './mappable_wpsdata';
import { InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { BehaviorSubject } from 'rxjs';
import { InteractionMode, InteractionState, initialInteractionState } from 'src/app/interactions/interactions.state';
import { featureCollection, feature } from '@turf/helpers';
import { bboxPolygon } from '@turf/turf';

@Component({

    selector: 'ukis-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None, // <-- required so that we can overwrite the #map style to "width:unset;" (otherwise map distorted when moving from scenarios to map)
})
export class MapComponent implements OnInit, AfterViewInit {


    controls: { attribution?: boolean, scaleLine?: boolean, zoom?: boolean, crosshair?: boolean };

    private interactionState: BehaviorSubject<InteractionState>

    constructor(
        public layersSvc: LayersService,
        public mapStateSvc: MapStateService,
        public mapSvc: MapOlService,
        private store: Store<State>,
        private httpClient: HttpClient
    ) {

        this.controls = { attribution: true, scaleLine: true };

        // listening for mapable products
        this.store.pipe(select(getMaplikeProducts)).subscribe(
            (products: Product[]) => {
                for (let product of products) {
                    if (isWmsData(product)) this.addWmsLayer(product);
                    else if (isVectorLayerData(product)) this.addGeojsonLayer(product);
                    else if (isBboxLayerData(product)) this.addBboxLayer(product);
                }
            }
        );

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
                const box = [coords[0], coords[1], coords[4], coords[5]];
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

    }

    ngAfterViewInit() {
        this.mapSvc.setCenter([-70.799, -33.990]);
        this.mapSvc.setZoom(8);
        this.mapSvc.setProjection(getProjection('EPSG:4326'));
    }


    private addGeojsonLayer(product: VectorLayerData): void {
        let layer = this.createGeojsonLayer(product);
        layer.opacity = 1.0;
        this.layersSvc.removeLayer(layer, "Overlays");
        this.layersSvc.addLayer(layer, "Overlays");
    }


    private createGeojsonLayer(product: VectorLayerData): VectorLayer {
        let layer: VectorLayer = new VectorLayer({
            id: `${product.description.id}_result_layer`,
            name: `${product.description.id}`,
            opacity: 1,
            type: "geojson",
            data: product.value[0],
            options: {
                style: product.description.vectorLayerAttributes.style
            },
            popup: <any>{
                asyncPupup: (obj, callback) => {
                    const html = product.description.vectorLayerAttributes.text(obj);
                    callback(html);
                }
            }
        });
        return layer;
    }

    private addBboxLayer(product: BboxLayerData): void {
        console.log("adding layer for product", product)
        let layer = this.createBboxLayer(product);
        layer.opacity = 1.0;
        this.layersSvc.removeLayer(layer, "Overlays");
        this.layersSvc.addLayer(layer, "Overlays");
    }

    private createBboxLayer(product: BboxLayerData): VectorLayer {
        let layer: VectorLayer = new VectorLayer({
            id: `${product.description.id}_result_layer`,
            name: `${product.description.id}`,
            opacity: 1,
            type: "geojson",
            data: featureCollection([bboxPolygon(product.value)]),
            options: {},
            popup: <any>{
                asyncPupup: (obj, callback) => {
                    const html = JSON.stringify(obj);
                    callback(html);
                }
            }
        });
        return layer;
    }


    private addWmsLayer(product: WmsData): void {
        let layer = this.createWmsLayer(product);
        layer.opacity = 1.0;
        this.layersSvc.removeLayer(layer, "Overlays");
        this.layersSvc.addLayer(layer, "Overlays");
    }

    private createWmsLayer(product: WmsData): RasterLayer {
        let url = new URL(product.value[0]);
        url.searchParams.set("height", "600");
        url.searchParams.set("width", "600");
        url.searchParams.set("bbox", "-75.629882815,-36.123046875,-66.0498046875,-30.41015625");
        url.searchParams.set("scs", this.mapSvc.getProjection().getCode());
        // @TODO: convert all searchparameter names to uppercase
        let layer: RasterLayer = new RasterLayer({
            id: `${product.description.id}_result_layer`,
            name: `${product.description.id}`,
            opacity: 1,
            removable: true,
            type: "wms",
            visible: true,
            url: `${url.origin}${url.pathname}?`,
            params: {
                "VERSION": url.searchParams.get("Version"),
                "LAYERS": url.searchParams.get("layers"),
                "WIDTH": url.searchParams.get("width"),
                "HEIGHT": url.searchParams.get("height"),
                "FORMAT": url.searchParams.get("format"),
                "BBOX": url.searchParams.get("bbox"),
                "SRS": url.searchParams.get("srs"),
                "TRANSPARENT": "TRUE"
            },
            legendImg: `${url.origin}${url.pathname}?REQUEST=GetLegendGraphic&SERVICE=WMS&VERSION=${url.searchParams.get("Version")}&STYLES=default&FORMAT=${url.searchParams.get("format")}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYER=${url.searchParams.get("layers")}`,
            popup: <any>{
                asyncPupup: (obj, callback) => {
                    this.getFeatureInfoPopup(obj, this.mapSvc, callback)
                }
            }
        });
        layer["crossOrigin"] = "anonymous";
        return layer;
    }


    /**
   * @TODO: move this functionality to the WMS-Output-object
   */
    private getFeatureInfoPopup(obj, mapSvc, callback) {
        let source = obj.source;
        let evt = obj.evt;
        let viewResolution = mapSvc.map.getView().getResolution();
        let properties: any = {};
        let url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, mapSvc.EPSG,
            { 'INFO_FORMAT': 'application/json' }
        );

        this.httpClient.get(url).subscribe(response => {
            const html = this.formatFeatureCollectionToTable(response);
            callback(html);
        })
    }

    private formatFeatureCollectionToTable(collection): string {
        let html = "<clr-datagrid>";
        for (let key in collection["features"][0]["properties"]) {
            html += `<clr-dg-column>${key}</clr-dg-column>`;
        }
        for (let feature of collection["features"]) {
            html += "<clr-dg-row>";
            for (let key in feature["properties"]) {
                let val = feature["properties"][key];
                html += `<clr-dg-cell>${val}</clr-dg-cell>`;
            }
            html += "</clr-dg-row>";
        }
        html += "</clr-datagrid>"
        return html;
    }

}
