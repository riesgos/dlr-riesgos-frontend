import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/wps/wps.datatypes';
import { isWmsData, isVectorLayerData, isBboxLayerData, BboxLayerData, VectorLayerData, WmsData } from './mappable_wpsdata';
import { VectorLayer, RasterLayer, Layer } from '@ukis/services-layers';
import { featureCollection } from '@turf/helpers';
import { bboxPolygon } from '@turf/turf';
import { MapOlService } from '@ukis/map-ol';
import { WMSCapabilities } from 'ol/format/WMSCapabilities';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';



interface WmsParameters {
    origin: string | null; path: string | null; version: string | null; layers: string | null; width: string | null; height: string | null; format: string | null; bbox: string | null; srs: string | null;
}



@Injectable()
export class LayerFactory {
    
    constructor(
        private httpClient: HttpClient,
        private mapSvc: MapOlService
    ) {}
    
    toLayer(product: Product): Layer | undefined {
        if (isWmsData(product)) return this.makeWmsLayer(product);
        else if (isVectorLayerData(product)) return this.makeGeojsonLayer(product);
        else if (isBboxLayerData(product)) return this.makeBboxLayer(product);
    }

    makeBboxLayer(product: BboxLayerData) {
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

    makeGeojsonLayer(product: VectorLayerData): VectorLayer {
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




    makeWmsLayer(product: WmsData): Observable<RasterLayer> {
        
        let val;
        if(product.description.type == "complex") val = product.value[0];
        if(product.description.type == "literal") val = product.value;

        let wmsParameters$: Observable<WmsParameters>;
        if(val.includes("GetMap")) {
            wmsParameters$ = this.parseGetMapUrl(val);
        }
        if(val.includes("GetCapabilities")) {
            wmsParameters$ = this.parseGetCapabilitiesUrl(val);
        }

        wmsParameters$.subscribe((paras: WmsParameters) => {

        });
        
        // @TODO: convert all searchparameter names to uppercase
        let layer: RasterLayer = new RasterLayer({
            id: `${product.description.id}_result_layer`,
            name: `${product.description.id}`,
            opacity: 1,
            removable: true,
            type: "wms",
            visible: true,
            url: `${origin}${path}?`,
            params: {
                "VERSION": version,
                "LAYERS": layers,
                "WIDTH": width,
                "HEIGHT": height,
                "FORMAT": format,
                "BBOX": bbox,
                "SRS": srs,
                "TRANSPARENT": "TRUE"
            },
            legendImg: `${origin}${path}?REQUEST=GetLegendGraphic&SERVICE=WMS&VERSION=${version}&STYLES=default&FORMAT=${format}&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYER=${layers}`,
            popup: <any>{
                asyncPupup: (obj, callback) => {
                    this.getFeatureInfoPopup(obj, this.mapSvc, callback)
                }
            }
        });
        layer["crossOrigin"] = "anonymous";
        return layer;
    }


    private parseGetMapUrl(urlString: string): Observable<WmsParameters> {
        const url = new URL(urlString);
        url.searchParams.set("height", "600");
        url.searchParams.set("width", "600");
        url.searchParams.set("bbox", "-75.629882815,-36.123046875,-66.0498046875,-30.41015625");
        url.searchParams.set("scs", this.mapSvc.getProjection().getCode());

        return of({
            origin: url.origin, 
            path: url.pathname, 
            version: url.searchParams.get("Version"), 
            layers: url.searchParams.get("layers"), 
            width: url.searchParams.get("width"), 
            height: url.searchParams.get("height"), 
            format: url.searchParams.get("format"),
            bbox: url.searchParams.get("bbox"), 
            srs: url.searchParams.get("srs")
        });
    }

    private parseGetCapabilitiesUrl(urlString: string): Observable<WmsParameters> {
        return this.httpClient.get(urlString).pipe(
            map(result => {
                resultJson = new WMSCapabilities().read(result);
                console.log(resultJson);
                return {

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