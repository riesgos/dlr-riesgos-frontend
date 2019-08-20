import { UserconfigurableWpsData, FeatureSelectUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WatchingProcess, ProcessStateTypes, Product, CustomProcess } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { Feature } from '@turf/helpers';
import { Observable, of } from 'rxjs';
import { WpsActions } from 'src/app/wps/wps.actions';



export const selectedRow: FeatureSelectUconfWpsData = {
    description: {
        id: 'selectedRow',
        options: [],
        reference: false,
        type: 'complex',
        wizardProperties: {
            fieldtype: 'select',
            name: 'Selected EQ'
        }
    },
    value: null
};


export const selectedEq: WpsData = {
    description: {
        id: 'quakeMLFile',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
    },
    value: null
};



export const EqSelection: WizardableProcess & CustomProcess & WatchingProcess = {
    id: 'EqSelection',
    name: 'Select earthquake',
    state: {type: ProcessStateTypes.unavailable},
    requiredProducts: ['selectedRows', 'selectedRow'],
    providedProduct: 'quakeMLFile',
    wizardProperties: {
        providerName: '',
        providerUrl: '',
        shape: 'earthquake'
    },

    execute: (inputs: WpsData[]): Observable<WpsData[]> => {
        let eqVal = null;
        for (const input of inputs) {
            if (input.description.id === 'selectedRow') {
                eqVal = input.value;
            }
        }

        return of([{
            ...selectedEq,
            value: eqVal
        }]);
    },

    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.description.id) {

            case 'selectedRows':

                const options = {};
                for (const feature of newProduct.value[0].features) {
                    options[feature.id] = feature;
                }

                return [{
                    description: {
                        id: 'selectedRow',
                        options: options,
                        reference: false,
                        type: 'complex',
                        wizardProperties: {
                            fieldtype: 'select',
                            name: 'Selected EQ'
                        }
                    },
                    value: null
                }];


            default:
                return [];
        }
    }
};
