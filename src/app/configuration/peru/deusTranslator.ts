import { ExecutableProcess, ProcessStateUnavailable, Product, AutorunningProcess } from 'src/app/wps/wps.datatypes';
import { fragilityRefPeru } from './modelProp';
import { shakemapXmlRefOutputPeru } from './shakyground';
import { exposureRefPeru } from './exposure';

/**
 * The Process 'DeusTranslator' serves as a helper: Deus expects it's inputs to have other ids than what the inputs really have.
 */


export const fragilityRefDeusInputPeru = {
    ...fragilityRefPeru,
    description: {
        ...fragilityRefPeru.description,
        id: 'fragility'
    },
    uid: 'deusTranslator_fragilityPeru'
};

export const shakemapRefDeusInputPeru = {
    ...shakemapXmlRefOutputPeru,
    description: {
        ...shakemapXmlRefOutputPeru.description,
        id: 'intensity'
    },
    uid: 'deusTranslator_intensityPeru'
};

export const exposureRefDeusInputPeru = {
    ...exposureRefPeru,
    description: {
        ...exposureRefPeru.description,
        id: 'exposure',
    },
    uid: 'deusTranslator_exposurePeru'
};


export const DeusTranslatorPeru: AutorunningProcess = {
    uid: 'DeusTranslator',
    name: 'DeusTranslator',
    requiredProducts: [fragilityRefPeru, shakemapXmlRefOutputPeru, exposureRefPeru].map(p => p.uid),
    providedProducts: [fragilityRefDeusInputPeru, shakemapRefDeusInputPeru, exposureRefDeusInputPeru].map(p => p.uid),
    state: new ProcessStateUnavailable(),
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {
            case fragilityRefPeru.uid:
                return [{
                    ...fragilityRefDeusInputPeru,
                    value: newProduct.value
                }];
            case shakemapXmlRefOutputPeru.uid:
                return [{
                    ...shakemapRefDeusInputPeru,
                    value: newProduct.value
                }];
            case exposureRefPeru.uid:
                const exposureDeus = {
                    ...exposureRefDeusInputPeru,
                    value: newProduct.value
                };
                delete exposureDeus.description.vectorLayerAttributes; // To avoid displaying exposure on map twice
                delete exposureDeus.description.name;
                return [exposureDeus];
            default:
                return [];
        }
    }
};
