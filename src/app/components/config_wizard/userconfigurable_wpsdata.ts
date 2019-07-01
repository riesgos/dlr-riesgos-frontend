import { WpsDataDescription } from 'projects/services-wps/src/public_api';




export interface StringUconfWD extends WpsDataDescription {
    wizardProperties: {
        fieldtype: "string"
    }
}

export interface BboxUconfWD extends WpsDataDescription {
    wizardProperties: {
        fieldtype: "bbox"
    }
}

export interface SelectUconfWD extends WpsDataDescription {
    wizardProperties: {
        fieldtype: "select", 
        options: string[]
    }
}



export type UserconfigurableWpsDataDescription = StringUconfWD | BboxUconfWD | SelectUconfWD;



export const isUserconfigurableWpsDataDescription = function(obj: WpsDataDescription): obj is UserconfigurableWpsDataDescription {
    return obj.hasOwnProperty("wizardProperties");
}