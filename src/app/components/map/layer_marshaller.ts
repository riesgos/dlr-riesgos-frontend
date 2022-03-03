import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from 'src/app/riesgos/riesgos.datatypes';
import { isWmsProduct, isVectorLayerProduct, isBboxLayerProduct, BboxLayerProduct,
    VectorLayerProduct, WmsLayerProduct, WmsLayerDescription, isMultiVectorLayerProduct,
    MultiVectorLayerProduct } from '../../riesgos/riesgos.datatypes.mappable';
import { featureCollection, FeatureCollection } from '@turf/helpers';
import { Feature as olFeature } from 'ol';
import { bboxPolygon } from '@turf/turf';
import { MapOlService } from '@dlr-eoc/map-ol';
import { WMSCapabilities } from 'ol/format';
import { map, tap } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { MapStateService } from '@dlr-eoc/services-map-state';
import { ProductVectorLayer, ProductRasterLayer, ProductLayer, ProductCustomLayer } from './map.types';
import { downloadBlob, downloadJson } from 'src/app/helpers/others';
import { Vector as olVectorLayer } from 'ol/layer';
import { Vector as olVectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import olTileLayer from 'ol/layer/Tile';
import olTileWMS from 'ol/source/TileWMS';
import olLayerGroup from 'ol/layer/Group';
import Polygon from 'ol/geom/Polygon';
import { laharContoursWms } from 'src/app/riesgos/scenarios/ecuador/laharWrapper';
import { GroupSliderComponent, SliderEntry } from '../dynamic/group-slider/group-slider.component';
import { VectorLegendComponent } from '../dynamic/vector-legend/vector-legend.component';
import { WebGlPolygonLayer } from '../../helpers/custom_renderers/renderers/polygon.renderer';
import * as hashFunction from 'imurmurhash';
import { bbox as tBbox, buffer as tBuffer } from '@turf/turf';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';
import Geometry from 'ol/geom/Geometry';



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

interface CacheEntry {
    hash: number;
    value: ProductLayer[];
}


@Injectable()
export class LayerMarshaller  {

    private cache: {[uid: string]: CacheEntry} = {};

    constructor(
        private httpClient: HttpClient,
        private mapSvc: MapOlService,
        public mapStateSvc: MapStateService,
        private store: Store<State>,
        private translator: SimplifiedTranslationService
        ) {}

    productsToLayers(products: Product[]): Observable<ProductLayer[]> {
        if (products.length === 0) {
            return of([]);
        }

        const observables$ = [];
        for (const product of products) {
            // observables$.push(this.toLayers(product));
            // before marshalling a product, checking if it's already in cache
            const hash = hashFunction(JSON.stringify(product)).result();
            if (this.cache[product.uid] && this.cache[product.uid].hash === hash) {
                observables$.push(of(this.cache[product.uid].value));
            } else {
                observables$.push(this.toLayers(product).pipe(
                    // after marshalling a product, adding it to the cache
                    tap((result: ProductLayer[]) => {
                        this.cache[product.uid] = {
                            hash,
                            value: result
                        };
                    }))
                );
            }
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

        // First of all, a bunch of special cases. Each one of those layers has some customizations after user-requests
        if (product.uid === laharContoursWms.uid) {
            return this.createLaharContourLayers(product);
        }
        if (['ashfall_damage_output_values', 'lahar_damage_output_values',
            'lahar_ashfall_damage_output_values',
             'eq_deus_output_values', 'ts_deus_output_values',
             'eq_deus_peru_output_values', 'ts_deus_output_values_peru'].includes(product.uid)) {
            return this.createWebglLayers(product as MultiVectorLayerProduct);
        }
        if (['initial_Exposure', 'initial_Exposure_Lahar',
            'ts_damage', 'ts_transition', 'ts_updated_exposure',
            'AssetmasterProcess_Exposure_Peru',
            'ts_damage_peru', 'ts_transition_peru', 'ts_updated_exposure_peru'].includes(product.uid)) {
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
                        break;
                    case 'Shakyground_sa10_wms':
                        layers[0].name = 'SA(1.0)';
                        break;
                    case 'Shakyground_wmsPeru':
                        layers[0].name = 'PGA';
                        break;
                    case 'Shakyground_sa03_wmsPeru':
                        layers[0].name = 'SA(0.3)';
                        break;
                    case 'Shakyground_sa10_wmsPeru':
                        layers[0].name = 'SA(1.0)';
                        break;
                }
                return layers;
            }));
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
        const data = product.value[0];
        const vl = new WebGlPolygonLayer({
            source,
            colorFunc: (f: olFeature<Polygon>) => {
                const style = product.description.vectorLayerAttributes.style(f, null, false);
                const color = style.fill_.color_;
                return [color[0] / 255, color[1] / 255, color[2] / 255];
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
                    let html = product.description.vectorLayerAttributes.text(obj);
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
                product.description.vectorLayerAttributes.summary
                    ? product.description.vectorLayerAttributes.summary(product.value)
                    : undefined
        });


        // Ugly hack: a custom layer is not supposed to have an 'options' property.
        // We set it here anyway, because we need options.style to be able to create a custom legend.
        ukisLayer['options'] = {
            style: (feature: olFeature<Geometry>, resolution: number) => {
                const props = feature.getProperties();
                return product.description.vectorLayerAttributes.style(feature, resolution, props.selected);
            }
        };

        if (product.description.vectorLayerAttributes.legendEntries) {
            ukisLayer.legendImg = {
                component: VectorLegendComponent,
                inputs: {
                    legendTitle: product.description.description,
                    resolution: 0.00005,
                    styleFunction: product.description.vectorLayerAttributes.style,
                    elementList: product.description.vectorLayerAttributes.legendEntries}
            };
        }

        return of(ukisLayer);
    }

    createLaharContourLayers(laharProduct: Product): Observable<ProductCustomLayer[]> {
        const basicLayers$ = this.makeWmsLayers(laharProduct as WmsLayerProduct);
        const laharLayers$ = basicLayers$.pipe(
            map((layers: ProductRasterLayer[]) => {
                const olLayers = layers.map(l => {
                    const layer = new olTileLayer({
                        source: new olTileWMS({
                          url: l.url,
                          params: l.params,
                          crossOrigin: 'anonymous'
                        })
                    });
                    layer.set('id', l.id);
                    return layer;
                });

                const layerGroup = new olLayerGroup({
                    layers: olLayers
                });

                const entries: SliderEntry[] = layers.map((l: ProductRasterLayer, index: number) => {
                    return {
                        id: l.id,
                        tickValue: index,
                        displayText: l.name.match(/(\d+)$/)[0] + 'min'
                    };
                });

                const laharLayer = new ProductCustomLayer({
                    hasFocus: false,
                    filtertype: 'Overlays',
                    productId: laharProduct.uid,
                    removable: true,
                    custom_layer: layerGroup,
                    id: laharProduct.uid,
                    name: laharProduct.uid,
                    action: {
                        component: GroupSliderComponent,
                        inputs: {
                            entries,
                            selectionHandler: (selectedId: string) => {
                                layerGroup.getLayers().forEach(l => {
                                    if (l.get('id') === selectedId) {
                                        l.setVisible(true);
                                    } else {
                                        l.setVisible(false);
                                    }
                                });
                            },
                        }
                      }
                });
                return [laharLayer];
            })
        );
        return laharLayers$;
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
            source: source
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
        });
        return of(riesgosLayer);
        // const layer: ProductVectorLayer = new ProductVectorLayer({
        //     productId: product.uid,
        //     id: `${product.uid}_${product.description.id}_result_layer`,
        //     name: `${product.description.name}`,
        //     attribution: '',
        //     removable: true,
        //     opacity: 1.0,
        //     type: 'geojson',
        //     filtertype: 'Overlays',
        //     data: featureCollection([bboxPolygon(bboxArray)]),
        //     options: { style: undefined },
        //     popup: null,
        //     icon: product.description.icon,
        //     hasFocus: false
        // });
        // layer.productId = product.uid;
        // return of(layer);
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
                    return vectorLayerProps.vectorLayerAttributes.style(feature, resolution, props.selected);
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
                        let html = vectorLayerProps.vectorLayerAttributes.text(obj);
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
                dynamicDescription: vectorLayerProps.vectorLayerAttributes.summary(product.value)
            });
            productLayer.productId = product.uid;

            // Ugly hack: a custom layer is not supposed to have an 'options' property.
            // We set it here anyway, because we need options.style to be able to create a custom legend.
            productLayer['options'] = {
                style: (feature: olFeature<Geometry>, resolution: number) => {
                    const props = feature.getProperties();
                    return vectorLayerProps.vectorLayerAttributes.style(feature, resolution, props.selected);
                }
            };

            if (vectorLayerProps.vectorLayerAttributes.legendEntries) {
                productLayer.legendImg = {
                    component: VectorLegendComponent,
                    inputs: {
                        legendTitle: vectorLayerProps.description,
                        resolution: 0.00005,
                        styleFunction: vectorLayerProps.vectorLayerAttributes.style,
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
                            let html = product.description.vectorLayerAttributes.text(obj);
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
                    dynamicDescription: product.description.vectorLayerAttributes.summary ? product.description.vectorLayerAttributes.summary(data) : undefined,
                });
                layer.productId = product.uid;

                if (product.description.vectorLayerAttributes.legendEntries) {
                    layer.legendImg = {
                        component: VectorLegendComponent,
                        inputs: {
                            legendTitle: product.description.description,
                            resolution: 0.00005,
                            styleFunction: product.description.vectorLayerAttributes.style,
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
        if (product.description.vectorLayerAttributes.style) {
            return of(product.description.vectorLayerAttributes.style);
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
                        url: `${paras.origin}${paras.path}?`,
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
                        legendImg: description.legendImg ? description.legendImg :  `${paras.origin}${paras.path}?REQUEST=GetLegendGraphic&SERVICE=WMS` +
                            `&VERSION=${paras.version}&STYLES=default&FORMAT=${paras.format}&BGCOLOR=0xFFFFFF` +
                            `&TRANSPARENT=TRUE&LAYER=${layerName}`,
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
                                const size = this.mapSvc.map.getSize();
                                const bbox = this.mapSvc.map.getView().calculateExtent(size);
                                const width = size[0];
                                const height = size[1];
                                let requestUrl = `${url}service=wms&version=1.1.1&request=GetMap&format=image/tiff&transparent=true&layers=${layers}&WIDTH=${width}&HEIGHT=${height}&BBOX=${bbox}&SRS=EPSG:4326`;
                                if (theLayer.params.STYLES) {
                                    requestUrl += `&STYLES=${theLayer.params.STYLES}`;
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