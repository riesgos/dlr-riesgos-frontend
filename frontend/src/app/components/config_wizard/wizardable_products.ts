import { FeatureCollection } from '@turf/helpers';
import { RiesgosProduct } from 'src/app/riesgos/riesgos.state';
import { WpsBboxValue } from '../../services/wps/wps.datatypes';


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



export interface StringUserConfigurableProduct {
    id: string,
    description: StringUserConfigurableProductDescription;
    value: string;
}

export interface StringSelectUserConfigurableProduct {
    id: string,
    description: StringSelectUserConfigurableProductDescription;
    value: string;
}

export interface BboxUserConfigurableProduct {
    id: string,
    description: BboxUserConfigurableProductDescription;
    value: WpsBboxValue | null;
}

export const isBboxUserConfigurableProduct = (prod: any): prod is BboxUserConfigurableProduct => {
    return isBboxUserConfigurableProductDescription(prod.description);
};

export interface FeatureSelectUconfProduct {
    id: string,
    description: FeatureSelectUconfPD;
    value: [FeatureCollection];
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
