import { FeatureCollection } from '@turf/helpers';
import { RiesgosProduct, RiesgosProductResolved } from 'src/app/riesgos/riesgos.state';


interface ProductDescription {}

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



export interface StringUserConfigurableProduct extends RiesgosProduct {
    description: StringUserConfigurableProductDescription;
}

export interface StringSelectUserConfigurableProduct extends RiesgosProduct {
    description: StringSelectUserConfigurableProductDescription;
}

export interface BboxUserConfigurableProduct extends RiesgosProduct {
    description: BboxUserConfigurableProductDescription;
}

export const isBboxUserConfigurableProduct = (prod: any): prod is BboxUserConfigurableProduct => {
    return isBboxUserConfigurableProductDescription(prod.description);
};

export interface FeatureSelectUconfProduct extends RiesgosProduct {
    description: FeatureSelectUconfPD;
}

export type WizardableProduct =
    StringUserConfigurableProduct |
    StringSelectUserConfigurableProduct |
    BboxUserConfigurableProduct |
    FeatureSelectUconfProduct;


export const isStringSelectableProduct = (obj: any): obj is StringSelectUserConfigurableProduct => {
    return obj.description.hasOwnProperty('options');
};

export const isWizardableProductDescription = (obj: ProductDescription): obj is UserConfigurableProductDescription => {
    return obj.hasOwnProperty('wizardProperties');
};

export const isWizardableProduct = (obj: any): obj is WizardableProduct => {
    return isWizardableProductDescription(obj.id);
};
