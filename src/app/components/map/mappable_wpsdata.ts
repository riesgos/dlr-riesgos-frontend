import { WpsDataDescription, WpsData } from 'projects/services-wps/src/public-api';



export interface BboxLayerDescription extends WpsDataDescription {
    type: 'bbox';
    name: string;
}


export interface BboxLayerData extends WpsData {
    description: BboxLayerDescription;
}


export const isBboxLayerDescription = (descr: WpsDataDescription): descr is BboxLayerDescription => {
    return descr.type === 'bbox';
};

export const isBboxLayerData = (data: WpsData): data is BboxLayerData => {
    return isBboxLayerDescription(data.description);
};


export interface VectorLayerDescription extends WpsDataDescription {
    format: 'application/vnd.geo+json' | 'application/json';
    type: 'complex';
    name: string;
    vectorLayerAttributes: {
        style?: any;
        text?: any;
        sldFile?: string
    };
}

export interface VectorLayerData extends WpsData {
    description: VectorLayerDescription;
}

export const isVectorLayerDescription = (description: WpsDataDescription): description is VectorLayerDescription => {
    const result = description.format === 'application/vnd.geo+json'
            && description.type === 'complex'
            && description.hasOwnProperty('vectorLayerAttributes');
    return result;
};


export const isVectorLayerData = (data: WpsData): data is VectorLayerData => {
    return isVectorLayerDescription(data.description);
};



export interface WmsLayerDescription extends WpsDataDescription {
    format: 'application/WMS';
    name: string;
    type: 'complex' | 'literal';
}

export interface WmsLayerData extends WpsData {
    description: WmsLayerDescription;
}


export const isWmsLayerDescription = (description: WpsDataDescription): description is WmsLayerDescription => {
    return description.format === 'application/WMS'
            && (description.type === 'complex' || description.type === 'literal');
};

export const isWmsData = (data: WpsData): data is WmsLayerData => {
    return isWmsLayerDescription(data.description);
};
