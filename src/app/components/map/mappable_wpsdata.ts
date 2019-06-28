import { WpsDataDescription, WpsData } from 'projects/services-wps/src/public_api';




export interface VectorLayerDescription extends WpsDataDescription {
    format: "application/vnd.geo+json", 
    type: "complex",
    style: any,
    text: any
}

export interface VectorLayerData extends WpsData {
    description: VectorLayerDescription
}

export const isVectorLayerDescription = (description: WpsDataDescription): description is VectorLayerDescription => {
    return description["format"] == "application/vnd.geo+json" && description["type"] == "complex";
}


export const isVectorLayerData = (data: WpsData): data is VectorLayerData => {
    return isVectorLayerDescription(data.description);
}



export interface WmsLayerDescription extends WpsDataDescription {
    format: "application/WMS", 
    type: "complex"
}

export interface WmsData extends WpsData {
    description: WmsLayerDescription
}


export const isWmsLayerDescription = (description: WpsDataDescription): description is WmsLayerDescription => {
    return description.format == "application/WMS" && description.type == "complex";
}

export const isWmsData = (data: WpsData): data is WmsData => {
    return isWmsLayerDescription(data.description);
}