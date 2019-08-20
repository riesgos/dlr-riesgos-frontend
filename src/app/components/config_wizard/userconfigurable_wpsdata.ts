import { WpsDataDescription, WpsData } from 'projects/services-wps/src/public-api';




export interface StringUconfWD extends WpsDataDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'string'
    };
}

export interface StringSelectUconfWD extends WpsDataDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'stringselect',
    };
    options: string[];
}

export interface BboxUconfWD extends WpsDataDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'bbox'
    };
}

export interface FeatureSelectUconfWD extends WpsDataDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'select',
    };
    options: {[key: string]: any};
}

export type UserconfigurableWpsDataDescription = StringUconfWD | StringSelectUconfWD | BboxUconfWD | FeatureSelectUconfWD;



export interface StringUconfWpsData extends WpsData {
    description: StringUconfWD;
}

export interface StringSelectUconfWpsData extends WpsData {
    description: StringSelectUconfWD;
}

export interface BboxUconfWpsData extends WpsData {
    description: BboxUconfWD;
}

export interface FeatureSelectUconfWpsData extends WpsData {
    description: FeatureSelectUconfWD;
}



export type UserconfigurableWpsData = StringUconfWpsData | StringSelectUconfWpsData | BboxUconfWpsData | FeatureSelectUconfWpsData;


export const isStringSelectableParameter = (obj: WpsData): obj is StringSelectUconfWpsData => {
    return obj.description.hasOwnProperty('options');
}


export const isUserconfigurableWpsDataDescription = (obj: WpsDataDescription): obj is UserconfigurableWpsDataDescription => {
    return obj.hasOwnProperty('wizardProperties');
};

export const isUserconfigurableWpsData = (obj: WpsData): obj is UserconfigurableWpsData => {
    return isUserconfigurableWpsDataDescription(obj.description);
};
