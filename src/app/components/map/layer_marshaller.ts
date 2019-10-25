import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product, ProductDescription } from 'src/app/wps/wps.datatypes';
import { isWmsData, isVectorLayerData, isBboxLayerData, BboxLayerData, VectorLayerData, WmsLayerData, WmsLayerDescription } from './mappable_wpsdata';
import { featureCollection } from '@turf/helpers';
import { bboxPolygon } from '@turf/turf';
import { MapOlService } from '@ukis/map-ol';
import { WMSCapabilities } from 'ol/format';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { Layer, VectorLayer, RasterLayer } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { SldParserService } from 'projects/sld-parser/src/public-api';
import { ProductVectorLayer, ProductRasterLayer, ProductLayer } from './map.types';
import tBbox from '@turf/bbox';
import tBuffer from '@turf/buffer';


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
        private sldParser: SldParserService,
        private store: Store<State>
        ) {}


    productsToLayers(products: Product[]): Observable<ProductLayer[]> {
        if (products.length === 0) {
            return of([]);
        }

        const obsables = [];
        for (const product of products) {
            obsables.push(this.toLayers(product));
        }
        return forkJoin(...obsables).pipe(
            map((results: ProductLayer[][]) => {
                const newLayers: ProductLayer[] = [];
                for (const result of results) {
                    for (const layer of result) {
                        newLayers.push(layer);
                    }
                }
                return newLayers;
            })
        );
    }


    toLayers(product: Product): Observable<ProductLayer[]> {
        if (isWmsData(product)) {
            return this.makeWmsLayers(product);
        } else if (isVectorLayerData(product)) {
            return this.makeGeojsonLayer(product).pipe(map(layer => [layer]));
        } else if (isBboxLayerData(product)) {
            return this.makeBboxLayer(product).pipe(map(layer => [layer]));
        } else {
            throw new Error(`this product cannot be converted into a layer: ${product}`);
        }
    }

    makeBboxLayer(product: BboxLayerData): Observable<ProductVectorLayer> {
        const bboxArray: [number, number, number, number] =
        [product.value.lllon, product.value.lllat, product.value.urlon, product.value.urlat];
        const layer: ProductVectorLayer = new ProductVectorLayer({
            id: `${product.description.id}_result_layer`,
            name: `${product.description.name}`,
            removable: false,
            opacity: 0.6,
            type: 'geojson',
            filtertype: 'Overlays',
            data: featureCollection([bboxPolygon(bboxArray)]),
            options: { style: undefined },
            popup: {
                asyncPupup: (obj, callback) => {
                    const html = JSON.stringify(bboxArray);
                    callback(html);
                }
            },
            // icon: 'caret',
            hasFocus: false
        });
        layer.productId = product.uid;
        return of(layer);
    }

    makeGeojsonLayer(product: VectorLayerData): Observable<ProductVectorLayer> {
        return this.getStyle(product).pipe(
            map(styleFunction => {

                const data = product.value[0];
                const bx = tBbox(tBuffer(data, 70, {units: 'kilometers'}));

                const layer: ProductVectorLayer = new ProductVectorLayer({
                    id: `${product.description.id}_result_layer`,
                    name: `${product.description.name}`,
                    opacity: 0.6,
                    removable: false,
                    type: 'geojson',
                    filtertype: 'Overlays',
                    data: data,
                    bbox: bx,
                    options: {
                        style: styleFunction
                    },
                    popup: {
                        asyncPupup: (obj, callback) => {
                            const html = product.description.vectorLayerAttributes.text(obj);
                            callback(html);
                        }
                    },
                    // icon: 'caret',
                    hasFocus: false
                });
                layer.productId = product.uid;
                if (product.description.description) {
                    layer.description = product.description.description;
                }
                if (product.description.name === 'available earthquakes') {
                    layer.legendImg = 'assets/layer-preview/eq_legend.png';
                }
                return layer;
            })
        );
    }

    private getStyle(product: VectorLayerData): Observable<CallableFunction | null> {
        if (product.description.vectorLayerAttributes.style) {
            return of(product.description.vectorLayerAttributes.style);
        } else if (product.description.vectorLayerAttributes.sldFile) {
            return this.sldParser.readStyleForLayer(product.description.vectorLayerAttributes.sldFile, product.description.id);
        } else {
            return of(null);
        }
    }

    makeWmsLayers(product: WmsLayerData): Observable<ProductRasterLayer[]> {
        if (product.description.type === 'complex') {
            const parseProcesses$: Observable<ProductRasterLayer[]>[] = [];
            for (const val of product.value) {
                parseProcesses$.push(this.makeWmsLayersFromValue(val, product.uid, product.description));
            }
            return forkJoin(...parseProcesses$).pipe(map((results: ProductRasterLayer[][]) => {
                const newLayers: ProductRasterLayer[] = [];
                for (const result of results) {
                    for (const layer of result) {
                        newLayers.push(layer);
                    }
                }
                return newLayers;
            }));
        } else if (product.description.type === 'literal') {
            const val = product.value;
            return this.makeWmsLayersFromValue(val, product.uid, product.description);
        } else {
            throw new Error(`Could not find a value in product ${product}`);
        }

    }

    private makeWmsLayersFromValue(val: string, uid: string, description: WmsLayerDescription): Observable<ProductRasterLayer[]> {

        let wmsParameters$: Observable<WmsParameters>;
        if (val.includes('GetMap')) {
            wmsParameters$ = this.parseGetMapUrl(val);
        } else if (val.includes('GetCapabilities')) {
            wmsParameters$ = this.parseGetCapabilitiesUrl(val);
        } else if (val.includes('http') && val.includes('://')) {
            wmsParameters$ = this.parseGetMapUrl(val);
        } else {
            throw new Error(`Cannot parse parameters from this value. ${val}`);
        }

        return wmsParameters$.pipe(map((paras: WmsParameters) => {
            const layers: ProductRasterLayer[] = [];
            if (paras) {
                for (const layername of paras.layers) {
                    // @TODO: convert all searchparameter names to uppercase
                    const layer: ProductRasterLayer = new ProductRasterLayer({
                        id: `${layername}_result_layer`,
                        name: `${layername}`,
                        opacity: 0.6,
                        removable: false,
                        type: 'wms',
                        filtertype: 'Overlays',
                        visible: true,
                        url: `${paras.origin}${paras.path}?`,
                        params: {
                            VERSION: paras.version,
                            LAYERS: layername,
                            WIDTH: paras.width,
                            HEIGHT: paras.height,
                            FORMAT: paras.format,
                            BBOX: paras.bbox,
                            SRS: paras.srs,
                            TRANSPARENT: true,
                            STYLES: description.styles ? description.styles[0] : '',
                        },
                        legendImg: `${paras.origin}${paras.path}?REQUEST=GetLegendGraphic&SERVICE=WMS` +
                            `&VERSION=${paras.version}&STYLES=default&FORMAT=${paras.format}&BGCOLOR=0xFFFFFF` +
                            `&TRANSPARENT=TRUE&LAYER=${layername}`,
                        popup: {
                            asyncPupup: (obj, callback) => {
                                this.getFeatureInfoPopup(obj, this.mapSvc, callback);
                            }
                        },
                        // icon: 'caret',
                        hasFocus: false
                    });
                    layer.productId = uid;

                    layer['crossOrigin'] = 'anonymous';

                    if (description.description) {
                        layer.description = description.description;
                    }

                    layers.push(layer);
                }
            }
            layers.reverse();
            return layers;
        }));
    }

    private parseGetMapUrl(urlString: string): Observable<WmsParameters> {

        const url = new URL(urlString);
        url.searchParams.set('height', '600');
        url.searchParams.set('width', '600');
        url.searchParams.set('bbox', '-75.629882815,-36.123046875,-66.0498046875,-30.41015625');
        url.searchParams.set('scs', this.mapSvc.getProjection().getCode());

        let layers: string[] = [];
        const layersString = url.searchParams.get('layers') || url.searchParams.get('LAYERS');
        if (layersString) {
            layers = layersString.split(',');
        }

        let width = 600;
        const widthString = url.searchParams.get('width') || url.searchParams.get('WIDTH');
        if (widthString) {
            width = parseInt(widthString, 10);
        }

        let height = 400;
        const heightString = url.searchParams.get('height') || url.searchParams.get('WIDTH');
        if (heightString) {
            height = parseInt(heightString, 10);
        }

        let bbox: number[] = [];
        const bboxString = url.searchParams.get('bbox') || url.searchParams.get('BBOX');
        if (bboxString) {
            bbox = bboxString.split(',').map(s => parseInt(s, 10));
        }

        return of({
            origin: url.origin,
            path: url.pathname,
            version: url.searchParams.get('Version') || url.searchParams.get('VERSION') || '1.1.1',
            layers: layers,
            width: width,
            height: height,
            format: url.searchParams.get('format') || url.searchParams.get('FORMAT') || 'image/png',
            bbox: bbox,
            srs: url.searchParams.get('srs') || url.searchParams.get('SRS') || this.mapSvc.getProjection().getCode(),
        });
    }

    private parseGetCapabilitiesUrl(urlString: string): Observable<WmsParameters> {
        const url = new URL(urlString);

        const headers = new HttpHeaders({
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        });

        return this.httpClient.get(urlString, { headers, responseType: 'text' }).pipe(
            map(result => {
                const resultJson = new WMSCapabilities().read(result);
                return {
                    origin: url.origin,
                    path: url.pathname,
                    version: resultJson.version,
                    layers: resultJson.Capability.Layer.Layer.map(layer => layer.Name),
                    width: 600,
                    height: 400,
                    format: 'image/png',
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
        const source = obj.source;
        const evt = obj.evt;
        const viewResolution = mapSvc.map.getView().getResolution() ||
            // throws exception: mapSvc.map.getView().getResolutionForExtent(this.mapSvc.getCurrentExtent()) ||
            mapSvc.map.getView().getResolutionForZoom();
        const properties: any = {};
        const url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, mapSvc.EPSG,
            { INFO_FORMAT: 'application/json' }
        );

        this.httpClient.get(url).subscribe(response => {
            const html = this.formatFeatureCollectionToTable(response);
            callback(html);
        });
    }

    private formatFeatureCollectionToTable(collection): string {
        let html = '';

        if(collection.id) html += `<h3>${collection.id}</h3>`;
        
        if(collection['features'].length > 0) {
            html += '<table>';
            html += '<tr>';
            for (let key in collection['features'][0]['properties']) {
                html += `<th>${key}</th>`;
            }
            html += '</tr>';
            for (let feature of collection['features']) {
                html += '<tr>';
                for (let key in feature['properties']) {
                    let val = feature['properties'][key];
                    html += `<td>${val}</td>`;
                }
                html += '</tr>';
            }
            html += '</table>'
        }

        const otherKeys = Object.keys(collection).filter(key => !['type', 'totalFeatures', 'features', 'crs'].includes(key));
        if (otherKeys.length > 0) {
            html += '<table>';
            for (const key of otherKeys) {
                const val = collection[key];
                html += `<tr> <td>${key}:</td> <td>${val}</td> </tr>`;
            }
            html += '</table>';
        }

        return html;
    }






}