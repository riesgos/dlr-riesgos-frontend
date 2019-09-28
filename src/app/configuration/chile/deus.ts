import { WpsProcess, ProcessStateUnavailable, Product, WatchingProcess } from 'src/app/wps/wps.datatypes';
import { shakemapRefOutput } from './shakyground';
import { schema, selectedRowsXml } from './assetmaster';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { buildingAndDamageClassesRef } from './modelProp';



// export const fragility: WpsData & Product = {
//     uid: 'fragility',
//     description: {
//         id: 'fragility',
//         reference: false,
//         type: 'complex',
//         format: 'application/json'
//     },
//     value: null
// };

export const loss: WpsData & Product = {
    uid: 'loss',
    description: {
        id: 'loss',
        reference: false,
        type: 'literal'
    },
    value: 'testinputs/loss_sara.json'
};

export const damage: WpsData & Product = {
    uid: 'damage',
    description: {
        id: 'damage',
        reference: false,
        type: 'complex',
        format: 'application/json'
    },
    value: null
};

export const transition: WpsData & Product = {
    uid: 'transition',
    description: {
        id: 'transition',
        reference: false,
        type: 'complex',
        format: 'application/json'
    },
    value: null
};

export const updated_exposure: WpsData & Product = {
    uid: 'updated_exposure',
    description: {
        id: 'updated_exposure',
        reference: false,
        type: 'complex',
        format: 'application/json'
    },
    value: null
};


export const Deus: WizardableProcess & WpsProcess & WatchingProcess = {
    id: 'org.n52.gfz.riesgos.algorithm.impl.DeusProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    state: new ProcessStateUnavailable(),
    name: 'DeusProcess',
    description: 'Damage and exposure update service',
    requiredProducts: [loss, buildingAndDamageClassesRef, schema, shakemapRefOutput, selectedRowsXml].map(p => p.uid),
    providedProducts: [damage, transition, updated_exposure].map(p => p.uid),
    wizardProperties: {
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        shape: 'dot-circle'
    },
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        if (newProduct.uid === buildingAndDamageClassesRef.uid) {
            const copy = {...newProduct};
            (copy as WpsData).description.id = 'fragility';
            return [copy];
        } else if (newProduct.uid === shakemapRefOutput.uid) {
            const copy = {...newProduct};
            (copy as WpsData).description.id = 'intensity';
            return [copy];
        } else if (newProduct.uid === selectedRowsXml.uid) {
            const copy = {...newProduct};
            (copy as WpsData).description.id = 'exposure';
            return [copy];
        }
        return [];
    }
};
