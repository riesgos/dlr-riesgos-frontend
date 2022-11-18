import { ProductDescription, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsBboxValue } from '../services/wps/wps.datatypes';
import { shape } from '../components/config_wizard/wizardable_processes';
import { FeatureCollection } from '@turf/helpers';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { LegendElement } from '../components/dynamic/vector-legend/vector-legend.component';
import { IDynamicComponent } from '@dlr-eoc/core-ui';
import GeometryCollection from 'ol/geom/GeometryCollection';
import { ProductLayer } from './map.types';
import { Observable } from 'rxjs';
import { MapOlService } from '@dlr-eoc/map-ol';
import { HttpClient } from '@angular/common/http';
import { LayersService } from '@dlr-eoc/services-layers';
import { LayerMarshaller } from './layer_marshaller';
import { Store } from '@ngrx/store';
import { State } from '../ngrx_register';



/**
 * This type allows the user to specify how a riesgos-product should be converted into one or more ukis-layers.
 * This interface should slowly phase out all the other ones in the file `riesgos.datatypes.mappable`.
 */
export interface MappableProduct extends Product {
    toUkisLayers(ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, httpClient: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller): Observable<ProductLayer[]>
}

export function isMappableProduct(product: Product): product is MappableProduct  {
    return isVectorLayerProduct(product) || isBboxLayerProduct(product)
            || isWmsProduct(product) || isMultiVectorLayerProduct(product)
            || 'toUkisLayers' in product;
}


export interface BboxLayerDescription extends ProductDescription {
    type: 'bbox';
    name: string;
    id: string;
    icon?: shape;
}


export interface BboxLayerProduct extends Product {
    description: BboxLayerDescription;
    value: WpsBboxValue | null;
}


export const isBboxLayerDescription = (descr: ProductDescription): descr is BboxLayerDescription => {
    return descr.hasOwnProperty('type') && descr['type'] === 'bbox';
};

export const isBboxLayerProduct = (data: Product): data is BboxLayerProduct => {
    return isBboxLayerDescription(data.description);
};


export interface VectorLayerProperties {
    vectorLayerAttributes: {
        featureStyle?: (feature: Feature<Geometry | GeometryCollection>, resolution: number, selected: boolean) => any;
        detailPopupHtml?: any;
        globalSummary?: (value: any) => IDynamicComponent,
        sldFile?: string,
        legendEntries?: LegendElement[]
    };
    description?: string;
    icon?: shape;
    name?: string;
}


export interface VectorLayerDescription extends ProductDescription, VectorLayerProperties {
    format: 'application/vnd.geo+json' | 'application/json';
    type: 'complex';
    id: string;
}

export interface VectorLayerProduct extends Product {
    description: VectorLayerDescription;
}

export const isVectorLayerDescription = (description: ProductDescription): description is VectorLayerDescription => {
    return description.hasOwnProperty('vectorLayerAttributes');
};


export const isVectorLayerProduct = (data: Product): data is VectorLayerProduct => {
    return isVectorLayerDescription(data.description);
};

export interface MultiVectorLayerDescription extends ProductDescription {
    format: 'application/vnd.geo+json' | 'application/json';
    type: 'complex';
    vectorLayers: VectorLayerProperties[];
}

/**
 * Sometimes we want to display on vector-dataset in more than one way.
 * A *MultiVectorLayerProduct* uses one VectorSource with multiple layers.
 */
export interface MultiVectorLayerProduct extends Product {
    description: MultiVectorLayerDescription;
}

export const isMultiVectorLayerDescription = (description: ProductDescription): description is MultiVectorLayerDescription => {
    return description.hasOwnProperty('vectorLayers');
};

export const isMultiVectorLayerProduct = (product: Product): product is MultiVectorLayerProduct => {
    return isMultiVectorLayerDescription(product.description);
};



export interface WmsLayerDescription extends ProductDescription {
    legendImg?: string | IDynamicComponent;
    name: string;
    type: 'complex' | 'literal';
    styles?: string[];
    format: 'application/WMS' | 'string';  // Ts-service returns wms-data as string-literal. Not sure if this is strictly correct.
    id: string;
    description?: string;
    icon?: shape;
    featureInfoRenderer?: (featureInfo: FeatureCollection) => string;
}

export interface WmsLayerProduct extends Product {
    description: WmsLayerDescription;
}


export const isWmsLayerDescription = (description: ProductDescription): description is WmsLayerDescription => {
    if (description['type'] === 'complex') {
        return description['format'] === 'application/WMS';
    } else if (description['type'] === 'literal') {
        return !!description['styles'] || !!description['featureInfoRenderer'] || !!description['legendImg'];
    }
    return false;
};

export const isWmsProduct = (data: Product): data is WmsLayerProduct => {
    const matchesWms = (str: string) => {
        return str.includes('service=wms') || str.includes('Service=Wms') || str.includes('SERVICE=WMS');
    };

    return isWmsLayerDescription(data.description)
        || data.description['format'] === 'application/WMS'
        || ((typeof data.value === 'string') && matchesWms(data.value as string))
        || ((Array.isArray(data.value)) && (typeof data.value[0] === 'string') && matchesWms(data.value[0] as string));
};
