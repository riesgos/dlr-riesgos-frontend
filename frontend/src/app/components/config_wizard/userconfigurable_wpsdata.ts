import { FeatureCollection } from '@turf/helpers';
import { Product, ProductDescription } from 'src/app/riesgos/riesgos.datatypes';
import { RiesgosProduct } from 'src/app/riesgos/riesgos.state';
import { WpsBboxValue } from '../../services/wps/wps.datatypes';




export interface StringUserConfigurableProductDescription extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'string',
        description?: string,
        signpost?: string,
    };
    defaultValue: string;
}

export interface StringSelectUserConfigurableProductDescription extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'stringselect',
        description?: string,
        signpost?: string,
    };
    options: string[];
    defaultValue: string;
}

export interface BboxUserConfigurableProductDescription extends ProductDescription {
    wizardProperties: {
        name: string,
        fieldtype: 'bbox',
        description?: string,
        signpost?: string,
    };
    defaultValue: any;
}

export const isBboxUserConfigurableProductDescription = (descr: ProductDescription): descr is BboxUserConfigurableProductDescription => {
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

export type UserConfigurableProductDescription = StringUserConfigurableProductDescription | StringSelectUserConfigurableProductDescription | BboxUserConfigurableProductDescription | FeatureSelectUconfPD;



export interface StringUserConfigurableProduct {
    uid: string,
    description: StringUserConfigurableProductDescription;
    value: string;
}

export interface StringSelectUserConfigurableProduct {
    uid: string,
    description: StringSelectUserConfigurableProductDescription;
    value: string;
}

export interface BboxUserConfigurableProduct {
    uid: string,
    description: BboxUserConfigurableProductDescription;
    value: WpsBboxValue | null;
}

export const isBboxUserConfigurableProduct = (prod: any): prod is BboxUserConfigurableProduct => {
    return isBboxUserConfigurableProductDescription(prod.description);
};

export interface FeatureSelectUconfProduct extends Product {
    uid: string,
    description: FeatureSelectUconfPD;
    value: [FeatureCollection];
}

export type UserConfigurableProduct =
    StringUserConfigurableProduct |
    StringSelectUserConfigurableProduct |
    BboxUserConfigurableProduct |
    FeatureSelectUconfProduct;


export const isStringSelectableProduct = (obj: any): obj is StringSelectUserConfigurableProduct => {
    return obj.description.hasOwnProperty('options');
};

export const isUserConfigurableProductDescription = (obj: ProductDescription): obj is UserConfigurableProductDescription => {
    return obj.hasOwnProperty('wizardProperties');
};

export const isUserConfigurableProduct = (obj: any): obj is UserConfigurableProduct => {
    return isUserConfigurableProductDescription(obj.id);
};


export const loadUserconfigProduct = (product: RiesgosProduct): UserConfigurableProduct | undefined => {
    const userConfigProd = userConfigRegistry[product.id];
    if (!userConfigProd) return undefined;
    return userConfigProd
}


const userConfigRegistry: {[id: string]: UserConfigurableProduct} = {
    
};