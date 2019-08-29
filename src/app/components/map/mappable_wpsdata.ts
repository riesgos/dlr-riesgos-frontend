import { ProductDescription, Product } from 'src/app/wps/wps.datatypes';



export interface BboxLayerDescription extends ProductDescription {
    type: 'bbox';
    name: string;
    id: string;
}


export interface BboxLayerData extends Product {
    description: BboxLayerDescription;
}


export const isBboxLayerDescription = (descr: ProductDescription): descr is BboxLayerDescription => {
    return descr.hasOwnProperty('type') && descr['type'] === 'bbox';
};

export const isBboxLayerData = (data: Product): data is BboxLayerData => {
    return isBboxLayerDescription(data.description);
};


export interface VectorLayerDescription extends ProductDescription {
    format: 'application/vnd.geo+json' | 'application/json';
    type: 'complex';
    name: string;
    id: string;
    vectorLayerAttributes: {
        style?: any;
        text?: any;
        sldFile?: string
    };
}

export interface VectorLayerData extends Product {
    description: VectorLayerDescription;
}

export const isVectorLayerDescription = (description: ProductDescription): description is VectorLayerDescription => {
    return description.hasOwnProperty('vectorLayerAttributes');
};


export const isVectorLayerData = (data: Product): data is VectorLayerData => {
    return isVectorLayerDescription(data.description);
};



export interface WmsLayerDescription extends ProductDescription {
    format: 'application/WMS';
    name: string;
    type: 'complex' | 'literal';
    styles?: string[];
    id: string;
}

export interface WmsLayerData extends Product {
    description: WmsLayerDescription;
}


export const isWmsLayerDescription = (description: ProductDescription): description is WmsLayerDescription => {
    return description['format'] === 'application/WMS'
            && (description['type'] === 'complex' || description['type'] === 'literal');
};

export const isWmsData = (data: Product): data is WmsLayerData => {
    return isWmsLayerDescription(data.description);
};
