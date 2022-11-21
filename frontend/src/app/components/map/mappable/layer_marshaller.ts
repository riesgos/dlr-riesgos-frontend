import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from 'src/app/riesgos/riesgos.datatypes';
import { isWmsProduct, isVectorLayerProduct, isBboxLayerProduct, BboxLayerProduct,
    VectorLayerProduct, WmsLayerProduct, WmsLayerDescription, isMultiVectorLayerProduct,
    MultiVectorLayerProduct, 
    isMappableProduct} from './mappable_products';
import { Feature as olFeature } from 'ol';
import { MapOlService } from '@dlr-eoc/map-ol';
import { WMSCapabilities } from 'ol/format';
import { map } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { MapStateService } from '@dlr-eoc/services-map-state';
import { ProductVectorLayer, ProductRasterLayer, ProductLayer, ProductCustomLayer } from './map.types';
import { downloadBlob, downloadJson } from 'src/app/helpers/others';
import { Vector as olVectorLayer } from 'ol/layer';
import { Vector as olVectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import Polygon from 'ol/geom/Polygon';
import { VectorLegendComponent } from '../../../components/dynamic/vector-legend/vector-legend.component';
import { WebGlPolygonLayer } from '../../../helpers/custom_renderers/renderers/polygon.renderer';
import tBbox from '@turf/bbox';
import tBuffer from '@turf/buffer';
import bboxPolygon from '@turf/bbox-polygon';
import { featureCollection, FeatureCollection } from '@turf/helpers';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';
import Geometry from 'ol/geom/Geometry';
import { Fill, Stroke, Style } from 'ol/style';
import { LayersService } from '@dlr-eoc/services-layers';
import { ConfigService } from '../../../services/configService/configService';



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
        public layersSvc: LayersService,
        private store: Store<State>,
        private translator: SimplifiedTranslationService,
        private configService: ConfigService
        ) {}

    productsToLayers(products: Product[]): Observable<ProductLayer[]> {
        if (products.length === 0) {
            return of([]);
        }

        const observables$ = [];
        for (const product of products) {
            observables$.push(this.toLayers(product));
        }
        return forkJoin(observables$).pipe(
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

        if (isMappableProduct(product)) {
            return product.toUkisLayers(product.value, this.mapSvc, this.layersSvc, this.httpClient, this.store, this);
        }

        // First of all, a bunch of special cases. Each one of those layers has some customizations after user-requests
        if ([].includes(product.uid)) {
            return this.createWebglLayers(product as MultiVectorLayerProduct);
        }
        if (['initial_Exposure', 'initial_Exposure_Lahar',
            'AssetmasterProcess_Exposure_Peru'].includes(product.uid)) {
            return this.createWebglLayer(product as VectorLayerProduct).pipe(map(layer => [layer]));
        }
        if (['Shakyground_wms', 'Shakyground_sa03_wms', 'Shakyground_sa10_wms',
            'Shakyground_wmsPeru', 'Shakyground_sa03_wmsPeru', 'Shakyground_sa10_wmsPeru'
            ].includes(product.uid)) {
            return this.makeWmsLayers(product as WmsLayerProduct).pipe(map(layers => {
                switch (product.uid) {
                    case 'Shakyground_wms':
                        layers[0].name = 'PGA';
                        break;
                    case 'Shakyground_sa03_wms':
                        layers[0].name = 'SA(0.3)';
                        layers[0].visible = false;
                        break;
                    case 'Shakyground_sa10_wms':
                        layers[0].name = 'SA(1.0)';
                        layers[0].visible = false;
                        break;
                    case 'Shakyground_wmsPeru':
                        layers[0].name = 'PGA';
                        break;
                    case 'Shakyground_sa03_wmsPeru':
                        layers[0].name = 'SA(0.3)';
                        layers[0].visible = false;
                        break;
                    case 'Shakyground_sa10_wmsPeru':
                        layers[0].name = 'SA(1.0)';
                        layers[0].visible = false;
                        break;
                }
                layers[0].legendImg = 'assets/images/shakemap_pga_legend_labeled.svg';
                layers[0].opacity = 0.3;
                return layers;
            }));
        }

        if (['QuakeledgerProcess_selectedRows', 'QuakeledgerProcess_selectedRowsPeru'].includes(product.uid)) {
            return this.makeGeojsonLayer(product as VectorLayerProduct).pipe(
                map(p => {
                    // @ts-ignore
                    p.popup.event = 'move';  // eq-selection shall show popups on hover, not on click.
                    return [p];
                })
            );
        }

        // Secondly, standard processing of mappable products.
        if (isWmsProduct(product)) {
            return this.makeWmsLayers(product);
        } else if (isMultiVectorLayerProduct(product)) {
            return this.makeGeojsonLayers(product);
        } else if (isVectorLayerProduct(product)) {
            return this.makeGeojsonLayer(product).pipe(map(layer => [layer]));
        } else if (isBboxLayerProduct(product)) {
            return this.makeBboxLayer(product).pipe(map(layer => [layer]));
        } else {
            throw new Error(`this product cannot be converted into a layer: ${product}`);
        }
    }

    createWebglLayers(product: MultiVectorLayerProduct): Observable<ProductCustomLayer[]> {
        const layers$: Observable<ProductCustomLayer>[] = [];
        const data = product.value[0];
        const source = new olVectorSource({
            features: new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: this.mapSvc.map.getView().getProjection().getCode()
            }).readFeatures(data)
        });
        for (const vectorLayerProps of product.description.vectorLayers) {
            const vectorLayerProduct: VectorLayerProduct = {
                ... product,
                description: {
                    id: product.uid + '_' + vectorLayerProps.name,
                    ... vectorLayerProps,
                    format: 'application/vnd.geo+json',
                    type: 'complex'
                }
            };
            const pcl$ = this.createWebglLayer(vectorLayerProduct, source);
            layers$.push(pcl$);
        }
        return forkJoin(layers$);
    }

    createWebglLayer(product: VectorLayerProduct, source?: olVectorSource<any>): Observable<ProductCustomLayer> {
        if (!source) {
            const data = product.value[0];
            source = new olVectorSource({
                features: new GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: this.mapSvc.map.getView().getProjection().getCode()
                }).readFeatures(data)
            });
        }
        const vl = new WebGlPolygonLayer({
            source,
            webGlColorFunction: (f: olFeature<Polygon>) => {
                const style = product.description.vectorLayerAttributes.featureStyle(f, null, false);
                const fillColor = style.fill_.color_;
                return [fillColor[0] / 255, fillColor[1] / 255, fillColor[2] / 255, fillColor[3]];
            }
        });
        const ukisLayer = new ProductCustomLayer({
            custom_layer: vl,
            productId: product.uid,
            id: product.uid + '_' + product.description.name,
            name: product.description.name,
            opacity: 1.0,
            visible: true,
            attribution: '',
            type: 'custom',
            removable: true,
            continuousWorld: true,
            time: null,
            filtertype: 'Overlays',
            popup: {
                popupFunction: (obj) => {
                    let html = product.description.vectorLayerAttributes.detailPopupHtml(obj);
                    html = this.translator.syncTranslate(html);
                    return html;
                }
            },
            icon: product.description.icon,
            hasFocus: false,
            actions: [{
                icon: 'download',
                title: 'download',
                action: (theLayer: any) => {
                    const geojsonParser = new GeoJSON({
                        dataProjection: 'EPSG:4326',
                        featureProjection: this.mapSvc.map.getView().getProjection().getCode()
                    });
                    const olFeatures = theLayer.custom_layer.getSource().getFeatures();
                    const data = JSON.parse(geojsonParser.writeFeatures(olFeatures));
                    if (data) {
                        downloadJson(data, `data_${theLayer.name}.json`);
                    }
                }
            }],
            dynamicDescription:
                product.description.vectorLayerAttributes.globalSummary
                    ? product.description.vectorLayerAttributes.globalSummary(product.value)
                    : undefined
        });


        // Ugly hack: a custom layer is not supposed to have an 'options' property.
        // We set it here anyway, because we need options.style to be able to create a custom legend.
        ukisLayer['options'] = {
            style: (feature: olFeature<Geometry>, resolution: number) => {
                const props = feature.getProperties();
                return product.description.vectorLayerAttributes.featureStyle(feature, resolution, props.selected);
            }
        };

        if (product.description.vectorLayerAttributes.legendEntries) {
            ukisLayer.legendImg = {
                component: VectorLegendComponent,
                inputs: {
                    legendTitle: product.description.description,
                    resolution: 0.00005,
                    styleFunction: product.description.vectorLayerAttributes.featureStyle,
                    elementList: product.description.vectorLayerAttributes.legendEntries}
            };
        }

        return of(ukisLayer);
    }

    makeBboxLayer(product: BboxLayerProduct): Observable<ProductCustomLayer> {
        const bboxArray: [number, number, number, number] =
            [product.value.lllon, product.value.lllat, product.value.urlon, product.value.urlat];
        const source = new olVectorSource({
            features: (new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: this.mapSvc.map.getView().getProjection().getCode()
            })).readFeatures(
                featureCollection([bboxPolygon(bboxArray)]))
        });
        const olLayer: olVectorLayer<olVectorSource<any>> = new olVectorLayer({
            source: source,
            style: (feature, resolution) => {
                const a = Math.min(0.8, Math.pow(resolution / 10000, 2.30));
                return new Style({
                    stroke: new Stroke({
                        color: `rgba(0, 0, 255, ${a + 0.2})`,
                        width: 2,
                    }),
                    fill: new Fill({
                        color: `rgba(0, 0, 255, ${a})`,
                    }),
                });
            }
        });

        const riesgosLayer: ProductCustomLayer = new ProductCustomLayer({
            custom_layer: olLayer,
            productId: product.uid,
            id: `${product.uid}_${product.description.id}_result_layer`,
            name: `${product.description.name}`,
            opacity: 1.0,
            visible: true,
            attribution: '',
            type: 'custom',
            removable: true,
            filtertype: 'Overlays',
            hasFocus: false,
            popup: {
                filterLayer: true
            },
        });
        return of(riesgosLayer);
    }

    /**
     * Reuses one vectorsource over multiple vectorlayers.
     * Note that this requires us to make these layers UKIS-'CustomLayers',
     * because UKIS-VectorLayers are assumed to have their own source of data.
     */
    makeGeojsonLayers(product: MultiVectorLayerProduct): Observable<ProductCustomLayer[]> {
        const source = new olVectorSource({
            features: (new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: this.mapSvc.map.getView().getProjection().getCode()
            })).readFeatures(product.value[0])
        });

        const layers = [];
        for (const vectorLayerProps of product.description.vectorLayers) {

            const layer: olVectorLayer<olVectorSource<any>> = new olVectorLayer({
                source: source,
                style: (feature: olFeature<Geometry>, resolution: number) => {
                    const props = feature.getProperties();
                    return vectorLayerProps.vectorLayerAttributes.featureStyle(feature, resolution, props.selected);
                }
            });

            const productLayer: ProductCustomLayer = new ProductCustomLayer({
                custom_layer: layer,
                productId: product.uid,
                id: product.uid + '_' + vectorLayerProps.name,
                name: vectorLayerProps.name,
                opacity: 1.0,
                visible: true,
                attribution: '',
                type: 'custom',
                removable: true,
                continuousWorld: true,
                time: null,
                filtertype: 'Overlays',
                popup: {
                    popupFunction: (obj) => {
                        let html = vectorLayerProps.vectorLayerAttributes.detailPopupHtml(obj);
                        html = this.translator.syncTranslate(html);
                        return html;
                    }
                },
                icon: vectorLayerProps.icon,
                hasFocus: false,
                actions: [{
                    icon: 'download',
                    title: 'download',
                    action: (theLayer: any) => {
                        const geojsonParser = new GeoJSON({
                            dataProjection: 'EPSG:4326',
                            featureProjection: this.mapSvc.map.getView().getProjection().getCode()
                        });
                        const olFeatures = theLayer.custom_layer.getSource().getFeatures();
                        const data = JSON.parse(geojsonParser.writeFeatures(olFeatures));
                        if (data) {
                            downloadJson(data, `data_${theLayer.name}.json`);
                        }
                    }
                }],
                dynamicDescription: vectorLayerProps.vectorLayerAttributes.globalSummary(product.value)
            });
            productLayer.productId = product.uid;

            // Ugly hack: a custom layer is not supposed to have an 'options' property.
            // We set it here anyway, because we need options.style to be able to create a custom legend.
            productLayer['options'] = {
                style: (feature: olFeature<Geometry>, resolution: number) => {
                    const props = feature.getProperties();
                    return vectorLayerProps.vectorLayerAttributes.featureStyle(feature, resolution, props.selected);
                }
            };

            if (vectorLayerProps.vectorLayerAttributes.legendEntries) {
                productLayer.legendImg = {
                    component: VectorLegendComponent,
                    inputs: {
                        legendTitle: vectorLayerProps.description,
                        resolution: 0.00005,
                        styleFunction: vectorLayerProps.vectorLayerAttributes.featureStyle,
                        elementList: vectorLayerProps.vectorLayerAttributes.legendEntries}
                };
            }

            layers.push(productLayer);
        }

        return of(layers);
    }

    makeGeojsonLayer(product: VectorLayerProduct): Observable<ProductVectorLayer> {
        return this.getSelectionAwareStyle(product).pipe(
            map(styleFunction => {

                const data = product.value[0];
                let bx = null;
                if (data.length > 1) { // don't want a buffer around single-entry layers
                    try {
                        bx = tBbox(tBuffer(data, 70, {units: 'kilometers'}));
                    } catch (error) {
                        console.log('could not do buffer with ', data, error);
                    }
                }

                const layer: ProductVectorLayer = new ProductVectorLayer({
                    productId: product.uid,
                    id: `${product.uid}_${product.description.id}_result_layer`,
                    name: `${product.description.name}`,
                    attribution: '',
                    opacity: 1.0,
                    removable: true,
                    type: 'geojson',
                    filtertype: 'Overlays',
                    data: data,
                    bbox: bx,
                    options: {
                        style: styleFunction
                    },
                    popup: {
                        single: true,
                        popupFunction: (obj) => {
                            let html = product.description.vectorLayerAttributes.detailPopupHtml(obj);
                            html = this.translator.syncTranslate(html);
                            return html;
                        }
                    },
                    icon: product.description.icon,
                    hasFocus: false,
                    actions: [{
                        icon: 'download',
                        title: 'download',
                        action: (theLayer: any) => {
                            const data = theLayer.data;
                            if (data) {
                                downloadJson(data, `data_${theLayer.name}.json`);
                            }
                        }
                    }],
                    dynamicDescription:
                        product.description.vectorLayerAttributes.globalSummary
                        ? product.description.vectorLayerAttributes.globalSummary(data)
                        : undefined,
                });
                layer.productId = product.uid;

                if (product.description.vectorLayerAttributes.legendEntries) {
                    layer.legendImg = {
                        component: VectorLegendComponent,
                        inputs: {
                            legendTitle: product.description.description,
                            resolution: 0.00005,
                            styleFunction: product.description.vectorLayerAttributes.featureStyle,
                            elementList: product.description.vectorLayerAttributes.legendEntries}
                    };
                }

                return layer;
            })
        );
    }

    private getSelectionAwareStyle(product: VectorLayerProduct): Observable<CallableFunction | null> {
        return this.getStyle(product).pipe(map(style => {
            if (style) {
                return (feature: olFeature<Geometry>, resolution: number) => {
                    const props = feature.getProperties();
                    return style(feature, resolution, props.selected);
                }
            } else {
                return style;
            }
        }));
    }

    private getStyle(product: VectorLayerProduct): Observable<CallableFunction | null> {
        if (product.description.vectorLayerAttributes.featureStyle) {
            return of(product.description.vectorLayerAttributes.featureStyle);
        } else if (product.description.vectorLayerAttributes.sldFile) {
            // return this.sldParser.readStyleForLayer(product.description.vectorLayerAttributes.sldFile, product.description.id);
            console.error('niewlandgeo/sldreader is currently not compatible with ol6')
            return null;
        } else {
            return of(null);
        }
    }

    makeWmsLayers(product: WmsLayerProduct): Observable<ProductRasterLayer[]> {
        if (product.description.type === 'complex') {
            const parseProcesses$: Observable<ProductRasterLayer[]>[] = [];
            for (const val of product.value) {
                parseProcesses$.push(this.makeWmsLayersFromValue(val, product.uid, product.description));
            }
            return forkJoin(parseProcesses$).pipe(map((results: ProductRasterLayer[][]) => {
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

                let wmsUrl = `${paras.origin}${paras.path}`;
                if (this.configService.needsProxy(wmsUrl)) {
                    wmsUrl = `${this.configService.proxify(paras.origin)}${paras.path}`;   
                    console.log(`Proxified ${wmsUrl}`);
                }

                for (const layerName of paras.layers) {
                    // @TODO: convert all search-parameter names to uppercase
                    const layer: ProductRasterLayer = new ProductRasterLayer({
                        productId: uid,
                        id: `${uid}_${layerName}_result_layer`,
                        name: `${layerName}`,
                        attribution: '',
                        opacity: 1.0,
                        removable: true,
                        type: 'wms',
                        filtertype: 'Overlays',
                        visible: true,
                        url: `${wmsUrl}?`,
                        params: {
                            VERSION: paras.version,
                            LAYERS: layerName,
                            WIDTH: paras.width,
                            HEIGHT: paras.height,
                            FORMAT: paras.format,
                            BBOX: paras.bbox,
                            SRS: paras.srs,
                            TRANSPARENT: true,
                            STYLES: description.styles ? description.styles[0] : '',
                        },
                        legendImg: description.legendImg ? description.legendImg :  `${wmsUrl}?REQUEST=GetLegendGraphic&SERVICE=WMS` +
                            `&VERSION=${paras.version}&FORMAT=${paras.format}&BGCOLOR=0xFFFFFF` +
                            `&TRANSPARENT=TRUE&LAYER=${layerName}&STYLES=${ description.styles ? + description.styles : 'default'}`,
                        popup: {
                            asyncPopup: (obj, callback) => {
                                this.getFeatureInfoPopup(obj, callback, description.featureInfoRenderer);
                            }
                        },
                        icon: description.icon,
                        hasFocus: false,
                        actions: [{
                            icon: 'download',
                            title: 'download',
                            action: (theLayer: any) => {
                                const url = theLayer.url;
                                const layers = theLayer.params.LAYERS;
                                const epsgCode = this.mapSvc.EPSG;
                                const size = this.mapSvc.map.getSize();
                                const bbox = this.mapSvc.map.getView().calculateExtent(size);
                                const width = size[0];
                                const height = size[1];
                                let requestUrl = `${url}service=wms&version=1.1.1&request=GetMap&format=image/geotiff&transparent=true&layers=${layers}&WIDTH=${width}&HEIGHT=${height}&BBOX=${bbox}&SRS=${epsgCode}`;
                                if (theLayer.params.STYLES && !theLayer.params.SLD && !theLayer.params.SLD_BODY) {
                                    requestUrl += `&STYLES=${theLayer.params.STYLES}`;
                                } else if (theLayer.params.SLD && theLayer.params.SLD_BODY) {
                                    requestUrl += `&STYLES=${theLayer.params.SLD}&SLD_BODY=${theLayer.params.SLD_BODY}`;
                                }
                                this.httpClient.get(requestUrl, { responseType: 'blob' }).subscribe((data) => {
                                    downloadBlob(data, `data_${theLayer.name}.tiff`);
                                });
                            }
                        }],
                    });
                    layer.productId = uid;

                    layer['crossOrigin'] = 'anonymous';

                    if (description.description) {
                        layer.description = description.description;
                    }

                    // special wish by theresa...
                    if (layerName.match(/Lahar_(N|S)_VEI\d\dmio_(maxvelocity|maxpressure|maxerosion|deposition)_\d\dm$/)
                     || layerName.match(/LaharArrival_(N|S)_VEI\d_wgs_s\d/)) {
                        layer.visible = false;
                    }
                    // special wish: legend for shakemap:
                    if (layerName.match(/N52:primary/)) {
                        layer.legendImg = 'assets/images/eq_legend_small.png';
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
    private getFeatureInfoPopup(obj, callback, featureInfoRenderer?: (featureInfo: FeatureCollection) => string) {
        const source = obj.source;
        const evt = obj.evt;

        const viewResolution = this.mapSvc.map.getView().getResolution();
        const properties: any = {};
        const url = source.getFeatureInfoUrl(
            evt.coordinate, viewResolution, this.mapSvc.EPSG,
            { INFO_FORMAT: 'application/json' }
        );

        this.httpClient.get(url).subscribe((response: FeatureCollection) => {
            let html;
            if (featureInfoRenderer) {
                html = featureInfoRenderer(response);
            } else {
                html = this.formatFeatureCollectionToTable(response);
            }
            html = this.translator.syncTranslate(html);
            callback(html);
        });
    }

    private formatFeatureCollectionToTable(collection: any): string {
        let html = '';

        if (collection.id) {
            html += `<h3>${collection.id}</h3>`;
        }

        if (collection['features'].length > 0) {
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
            html += '</table>';
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