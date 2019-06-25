import { WpsData } from 'projects/services-wps/src/public_api';




export interface UserconfigurableWpsData extends WpsData {
    fieldtype: "string" | "select" | "bbox"
}

export interface StringUconfWD extends UserconfigurableWpsData {
    fieldtype: "string"
}

export interface BboxUconfWD extends UserconfigurableWpsData {
    fieldtype: "bbox"
}

export interface SelectUconfWD extends UserconfigurableWpsData {
    fieldtype: "select", 
    options: string[]
}

export const isUserconfigurableWpsData = function(obj: WpsData): obj is UserconfigurableWpsData {
    return obj.hasOwnProperty("fieldtype");
}