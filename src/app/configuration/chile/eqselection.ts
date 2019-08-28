import { FeatureSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WatchingProcess, ProcessStateTypes, Product, CustomProcess } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { Observable, of } from 'rxjs';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { selectedEqs } from './quakeledger';



export const userinputSelectedEq: FeatureSelectUconfProduct & VectorLayerData & WpsData = {
    uid: 'user_selectedRow',
    description: {
        id: 'selectedRow',
        options: [],
        defaultValue: null,
        reference: false,
        type: 'complex',
        format: 'application/vnd.geo+json',
        name: 'selected earthquake',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                return new olStyle({
                    image: new olCircle({
                        radius: 30,
                        fill: new olFill({
                            color: 'blue'
                        }),
                        stroke: new olStroke({
                            color: 'white',
                            witdh: 1
                        })
                    })
                });
            },
            text: (feature: olFeature) => {
                return JSON.stringify(feature);
            }
        },
        wizardProperties: {
            fieldtype: 'select',
            name: 'Selected EQ'
        }
    },
    value: null
};


export const selectedEq: WpsData & Product = {
    uid: 'EqSelection_quakeMLFile',
    description: {
        id: 'quakeMLFile',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex'
    },
    value: null
};



export const EqSelection: WizardableProcess & CustomProcess & WatchingProcess = {
    id: 'EqSelection',
    name: 'Select earthquake',
    state: { type: ProcessStateTypes.unavailable },
    requiredProducts: [selectedEqs, userinputSelectedEq].map(p => p.uid),
    providedProducts: [selectedEq.uid],
    wizardProperties: {
        providerName: '',
        providerUrl: '',
        shape: 'earthquake'
    },

    execute: (inputs: Product[]): Observable<Product[]> => {
        const eqVal = inputs.find(i => i.uid === 'user_selectedRow').value;
        return of([{
            ...selectedEq,
            value: eqVal
        }]);
    },

    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {

            case 'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess_selectedRows':
                const options = {};
                for (const feature of newProduct.value[0].features) {
                    options[feature.id] = feature;
                }

                userinputSelectedEq.description.options = options;

                return [userinputSelectedEq];

            default:
                return [];
        }
    }
};
