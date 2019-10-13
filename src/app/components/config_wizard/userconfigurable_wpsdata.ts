import { FeatureCollection } from '@turf/helpers';
import { Product, ProductDescription } from 'src/app/wps/wps.datatypes';
import { WpsBboxData, WpsBboxValue } from 'projects/services-wps/src/public-api';




export interface StringUconfPD extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'string',
        description?: string
    };
    defaultValue: string;
}

export interface StringSelectUconfPD extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'stringselect',
        description?: string
    };
    options: string[];
    defaultValue: string;
}

export interface BboxUconfPD extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'bbox',
        description?: string
    };
    defaultValue: any;
}

export interface FeatureSelectUconfPD extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'select',
        description?: string
    };
    options: {[key: string]: any};
    defaultValue: [FeatureCollection];
}

export type UserconfigurableProductDescription = StringUconfPD | StringSelectUconfPD | BboxUconfPD | FeatureSelectUconfPD;



export interface StringUconfProduct extends Product {
    description: StringUconfPD;
    value: string;
}

export interface StringSelectUconfProduct extends Product {
    description: StringSelectUconfPD;
    value: string;
}

export interface BboxUconfProduct extends Product {
    description: BboxUconfPD;
    value: WpsBboxValue | null;
}

export interface FeatureSelectUconfProduct extends Product {
    description: FeatureSelectUconfPD;
    value: [FeatureCollection];
}



export type UserconfigurableProduct = StringUconfProduct | StringSelectUconfProduct | BboxUconfProduct | FeatureSelectUconfProduct;


export const isStringSelectableProduct = (obj: Product): obj is StringSelectUconfProduct => {
    return obj.description.hasOwnProperty('options');
}


export const isUserconfigurableProductDescription = (obj: ProductDescription): obj is UserconfigurableProductDescription => {
    return obj.hasOwnProperty('wizardProperties');
};

export const isUserconfigurableProduct = (obj: Product): obj is UserconfigurableProduct => {
    return isUserconfigurableProductDescription(obj.description);
};
