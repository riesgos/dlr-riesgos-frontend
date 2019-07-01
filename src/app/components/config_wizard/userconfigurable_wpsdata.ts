import { WpsDataDescription, WpsData } from 'projects/services-wps/src/public_api';




export interface StringUconfWD extends WpsDataDescription {
    wizardProperties: {
        name: string,
        fieldtype: "string"
    }
}

export interface BboxUconfWD extends WpsDataDescription {
    wizardProperties: {
        name: string,
        fieldtype: "bbox"
    }
}

export interface SelectUconfWD extends WpsDataDescription {
    wizardProperties: {
        name: string,
        fieldtype: "select", 
        options: string[]
    }
}



export type UserconfigurableWpsDataDescription = StringUconfWD | BboxUconfWD | SelectUconfWD;



export interface StringUconfWpsData extends WpsData {
    description: StringUconfWD
}

export interface BboxUconfWpsData extends WpsData {
    description: BboxUconfWD
}

export interface SelectUconfWpsData extends WpsData {
    description: SelectUconfWD
}



export type UserconfigurableWpsData = StringUconfWpsData | BboxUconfWpsData | SelectUconfWpsData;



export const isUserconfigurableWpsDataDescription = function(obj: WpsDataDescription): obj is UserconfigurableWpsDataDescription {
    return obj.hasOwnProperty("wizardProperties");
}

export const isUserconfigurableWpsData = function(obj: WpsData): obj is UserconfigurableWpsData {
    return isUserconfigurableWpsDataDescription(obj.description);
}