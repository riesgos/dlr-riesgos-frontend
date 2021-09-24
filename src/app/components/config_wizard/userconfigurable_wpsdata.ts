import { FeatureCollection } from '@turf/helpers';
import { Product, ProductDescription } from 'src/app/riesgos/riesgos.datatypes';
import { WpsBboxData, WpsBboxValue } from '@dlr-eoc/utils-ogc';




export interface StringUconfPD extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'string',
        description?: string,
        signpost?: string,
    };
    defaultValue: string;
}

export interface StringSelectUconfPD extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'stringselect',
        description?: string,
        signpost?: string,
    };
    options: string[];
    defaultValue: string;
}

export interface BboxUconfPD extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'bbox',
        description?: string,
        signpost?: string,
    };
    defaultValue: any;
}

export const isBboxUconfPD = (descr: ProductDescription): descr is BboxUconfPD => {
    return descr['wizardProperties'] && descr['wizardProperties']['fieldtype'] === 'bbox';
};

export interface FeatureSelectUconfPD extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'select',
        description?: string,
        signpost?: string,
    };
    featureSelectionOptions: {[key: string]: FeatureCollection};
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

export const isBboxUconfProd = (prod: Product): prod is BboxUconfProduct => {
    return isBboxUconfPD(prod.description);
};

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
