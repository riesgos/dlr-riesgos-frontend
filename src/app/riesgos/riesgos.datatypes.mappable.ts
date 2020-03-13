import { ProductDescription, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsBboxValue } from '@dlr-eoc/services-ogc';
import { shape } from '../components/config_wizard/wizardable_processes';
import { FeatureCollection, Feature } from '@turf/helpers';
import { LegendElement } from '@dlr-eoc/layer-control/src/lib/vector-legend/vector-legend.component';



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
        style?: (feature: Feature, resolution: number, selected: boolean) => any;
        text?: any;
        summary?: (value: any) => string,
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

export interface MulitVectorLayerDescription extends ProductDescription {
    format: 'application/vnd.geo+json' | 'application/json';
    type: 'complex';
    vectorLayers: VectorLayerProperties[];
}

/**
 * Sometimes we want to display on vector-dataset in more than one way.
 * A *MultiVectorLayerProduct* uses one VectorSource with multiple layers.
 */
export interface MultiVectorLayerProduct extends Product {
    description: MulitVectorLayerDescription;
}

export const isMultiVectorLayerDescription = (description: ProductDescription): description is MulitVectorLayerDescription => {
    return description.hasOwnProperty('vectorLayers');
};

export const isMultiVectorLayerProduct = (product: Product): product is MultiVectorLayerProduct => {
    return isMultiVectorLayerDescription(product.description);
};



export interface WmsLayerDescription extends ProductDescription {
    format: 'application/WMS';
    name: string;
    type: 'complex' | 'literal';
    styles?: string[];
    id: string;
    description?: string;
    icon?: shape;
    featureInfoRenderer?: (featureInfo: FeatureCollection) => string;
}

export interface WmsLayerProduct extends Product {
    description: WmsLayerDescription;
}


export const isWmsLayerDescription = (description: ProductDescription): description is WmsLayerDescription => {
    return description['format'] === 'application/WMS'
            && (description['type'] === 'complex' || description['type'] === 'literal');
};

export const isWmsProduct = (data: Product): data is WmsLayerProduct => {
    return isWmsLayerDescription(data.description)
        || ((data.description['format'] === 'string' || data.description['format'] === 'application/WMS') && (data.value as string).includes('wms'));
};
