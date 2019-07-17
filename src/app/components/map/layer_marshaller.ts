import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from 'src/app/wps/wps.datatypes';
import { isWmsData, isVectorLayerData, isBboxLayerData, BboxLayerData, VectorLayerData, WmsLayerData } from './mappable_wpsdata';
//import { VectorLayer, RasterLayer, Layer, LayersService } from '@ukis/services-layers';
import { featureCollection } from '@turf/helpers';
import { bboxPolygon } from '@turf/turf';
import { MapOlService } from '@ukis/map-ol';
import { WMSCapabilities } from 'ol/format';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { Layer, VectorLayer, RasterLayer } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';

/**
 * Why do wo add another layer of translation here, instead of translating in wpsClient?
 * Pro translate in wps-client: 
 *  - 
 * Pro translate in separate layer: 
 *  - data in store should be in a *general* format, layer-types are too specific
 *  - 
 */

interface WmsParameters {
    origin: string; 
    path: string; 
    version: string; 
    layers: string[]; 
    width: number; 
    height: number; 
    format: string; 
    bbox: number[] | null; 
    srs: string;
}


@Injectable()
export class LayerMarshaller  {
    
    constructor(
        private httpClient: HttpClient,
        private mapSvc: MapOlService,
        public mapStateSvc: MapStateService,
        private store: Store<State>
        ) {}
        


    toLayers(product: Product): Observable<Layer[]> {
        if (isWmsData(product)) return this.makeWmsLayers(product);
        else if (isVectorLayerData(product)) return this.makeGeojsonLayer(product).pipe(map(layer => [layer]));
        else if (isBboxLayerData(product)) return this.makeBboxLayer(product).pipe(map(layer => [layer]));
        else throw new Error(`this product cannot be converted into a layer: ${product}`);
    }

    makeBboxLayer(product: BboxLayerData): Observable<VectorLayer> {
        let layer: VectorLayer = new VectorLayer({
            id: `${product.description.id}_result_layer`,
            name: `${product.description.name}`,
            opacity: 1,
            type: "geojson",
            data: featureCollection([bboxPolygon(product.value)]),
            options: {},
            popup: <any>{
                asyncPupup: (obj, callback) => {
                    const html = JSON.stringify(product.value);
                    callback(html);
                }
            }
        });
        return of(layer);
    }

    makeGeojsonLayer(product: VectorLayerData): Observable<VectorLayer> {

        const style = this.getStyle(product);

        let layer: VectorLayer = new VectorLayer({
            id: `${product.description.id}_result_layer`,
            name: `${product.description.name}`,
            opacity: 1,
            type: "geojson",
            data: product.value[0],
            options: {
                style: style
            },
            popup: <any>{
                asyncPupup: (obj, callback) => {
                    const html = product.description.vectorLayerAttributes.text(obj);
                    callback(html);
                }
            }
        });
        return of(layer);
    }

    private getStyle(product: VectorLayerData) {
        if (product.description.vectorLayerAttributes.style) return product.description.vectorLayerAttributes.style;
        else if (product.description.vectorLayerAttributes.sldFile) return null;
        else return null;
    }

    makeWmsLayers(product: WmsLayerData): Observable<RasterLayer[]> {
        
        let val;
        if(product.description.type == "complex") val = product.value[0];
        else if(product.description.type == "literal") val = product.value;
        else throw new Error(`Could not find a value in product ${product}`);

        let wmsParameters$: Observable<WmsParameters>;
        if(val.includes("GetMap")) {
            wmsParameters$ = this.parseGetMapUrl(val);
        }
        else if(val.includes("GetCapabilities")) {
            wmsParameters$ = this.parseGetCapabilitiesUrl(val);
        }
        else throw new Error(`Cannot parse parameters from this value. ${val}`);

        
        return wmsParameters$.pipe(map((paras: WmsParameters) => {
            let layers: RasterLayer[] = [];
            if(paras) {
                for (let layername of paras.layers) {
                    // @TODO: convert all searchparameter names to uppercase
                    let layer: RasterLayer = new RasterLayer({
                        id: `${layername}_result_layer`,
                        name: `${layername}`,
                        opacity: 1,
                        removable: true,
                        type: "wms",
                        visible: true,
                        url: `${paras.origin}${paras.path}?`,
                        params: {
                            "VERSION": paras.version,
                            "LAYERS": layername,
                            "WIDTH": paras.width,
                            "HEIGHT": paras.height,
                            "FORMAT": paras.format,
                            "BBOX": paras.bbox,
                            "SRS": paras.srs,
                            "TRANSPARENT": "TRUE"
                        },
                        legendImg: `${paras.origin}${paras.path}?REQUEST=GetLegendGraphic&SERVICE=WMS&VERSION=${paras.version}&STYLES=default&FORMAT=${paras.format}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYER=${layername}`,
                        popup: <any>{
                            asyncPupup: (obj, callback) => {
                                this.getFeatureInfoPopup(obj, this.mapSvc, callback)
                            }
                        }
                    });
                    layer["crossOrigin"] = "anonymous";
                    layers.push(layer);
                }
            }
            return layers;
        }));
        
    }


    private parseGetMapUrl(urlString: string): Observable<WmsParameters> {

        const url = new URL(urlString);
        url.searchParams.set("height", "600");
        url.searchParams.set("width", "600");
        url.searchParams.set("bbox", "-75.629882815,-36.123046875,-66.0498046875,-30.41015625");
        url.searchParams.set("scs", this.mapSvc.getProjection().getCode());

        let layers: string[] = [];
        let layersString = url.searchParams.get("layers");
        if(layersString) layers = layersString.split(",");

        let width = 600;
        let widthString = url.searchParams.get("width");
        if(widthString) width = parseInt(widthString);

        let height = 400;
        let heightString = url.searchParams.get("height");
        if(heightString) height = parseInt(heightString);

        let bbox: number[] = [];
        let bboxString = url.searchParams.get("bbox");
        if(bboxString) bbox = bboxString.split(",").map(s => parseInt(s))

        return of({
            origin: url.origin, 
            path: url.pathname, 
            version: url.searchParams.get("Version") || "1.1.1", 
            layers: layers, 
            width: width, 
            height: height, 
            format: url.searchParams.get("format") || "image/png",
            bbox: bbox, 
            srs: url.searchParams.get("srs") || this.mapSvc.getProjection().getCode()
        });
    }

    private parseGetCapabilitiesUrl(urlString: string): Observable<WmsParameters> {
        const url = new URL(urlString);

        let headers = new HttpHeaders({
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        });

        return this.httpClient.get(urlString, { headers: headers, responseType: 'text' }).pipe(
            map(result => {
                const resultJson = new WMSCapabilities().read(result);
                console.log(resultJson);
                return {
                    origin: url.origin, 
                    path: url.pathname, 
                    version: resultJson.version, 
                    layers: resultJson.Capability.Layer.Layer.map(layer => layer.Name), 
                    width: 600, 
                    height: 400, 
                    format: "image/png",
                    bbox: resultJson.Capability.Layer.BoundingBox[0].extent, 
                    srs: resultJson.Capability.Layer.CRS[0]
                };
            })
        );
    }


    /**
   * @TODO: move this functionality to the WMS-Output-object
   */
    private getFeatureInfoPopup(obj, mapSvc, callback) {
        let source = obj.source;
        let evt = obj.evt;
        let viewResolution = mapSvc.map.getView().getResolution() || 
            // throws exception: mapSvc.map.getView().getResolutionForExtent(this.mapSvc.getCurrentExtent()) || 
            mapSvc.map.getView().getResolutionForZoom();
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
        let html = "";
        
        if(collection.id) html += `<h3>${collection.id}</h3>`;
        
        if(collection["features"].length > 0) {
            html += "<table>";
            html += "<tr>";
            for (let key in collection["features"][0]["properties"]) {
                html += `<th>${key}</th>`;
            }
            html += "</tr>";
            for (let feature of collection["features"]) {
                html += "<tr>";
                for (let key in feature["properties"]) {
                    let val = feature["properties"][key];
                    html += `<td>${val}</td>`;
                }
                html += "</tr>";
            }
            html += "</table>"
        }
        
        const otherKeys = Object.keys(collection).filter(key => !["type", "totalFeatures", "features", "crs"].includes(key));
        if(otherKeys.length > 0) {
            html += "<table>";
            for (let key of otherKeys) {
                const val = collection[key];
                html += `<tr> <td>${key}:</td> <td>${val}</td> </tr>`;
            }
            html += "</table>"
        }
        
        return html;
    }






}