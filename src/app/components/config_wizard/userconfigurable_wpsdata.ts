import { WpsDataDescription, WpsData } from 'projects/services-wps/src/public_api';




export interface UserconfigurableWpsDataDescription extends WpsDataDescription {
    fieldtype: "string" | "select" | "bbox"
}

export interface StringUconfWDD extends UserconfigurableWpsDataDescription {
    fieldtype: "string"
}

export interface BboxUconfWDD extends UserconfigurableWpsDataDescription {
    fieldtype: "bbox"
}

export interface SelectUconfWDD extends UserconfigurableWpsDataDescription {
    fieldtype: "select", 
    options: string[]
}

export function isUserconfigurableWpsDataDescription(obj: WpsDataDescription): obj is UserconfigurableWpsDataDescription {
    return obj.hasOwnProperty("fieldtype");
}