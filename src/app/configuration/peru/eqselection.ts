import { FeatureSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { AutorunningProcess, ProcessStateTypes, Product, ExecutableProcess } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { Observable, of } from 'rxjs';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { selectedEqsPeru } from './quakeledger';
import { FeatureCollection, featureCollection } from '@turf/helpers';



export const userinputSelectedEqPeru: FeatureSelectUconfProduct & VectorLayerData & WpsData = {
    uid: 'user_selectedRowPeru',
    description: {
        id: 'selectedRow',
        options: {},
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
            text: (props: object) => {
                return JSON.stringify(props);
              }
        },
        wizardProperties: {
            fieldtype: 'select',
            name: 'Selected EQ'
        }
    },
    value: null
};


export const selectedEqPeru: WpsData & Product = {
    uid: 'EqSelection_quakeMLFilePeru',
    description: {
        id: 'quakeMLFile',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex'
    },
    value: null
};



export const EqSelectionPeru: WizardableProcess & ExecutableProcess & AutorunningProcess = {
    uid: 'EqSelectionPeru',
    name: 'Select earthquake',
    state: { type: ProcessStateTypes.unavailable },
    requiredProducts: [selectedEqsPeru, userinputSelectedEqPeru].map(p => p.uid),
    providedProducts: [selectedEqPeru.uid],
    wizardProperties: {
        providerName: '',
        providerUrl: '',
        shape: 'earthquake'
    },

    execute: (inputs: Product[]): Observable<Product[]> => {
        const eqVal = inputs.find(i => i.uid === userinputSelectedEqPeru.uid).value;
        return of([{
            ...selectedEqPeru,
            value: eqVal
        }]);
    },

    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {

            case selectedEqsPeru.uid:
                const options = {};
                for (const feature of newProduct.value[0].features) {
                    options[feature.id] = featureCollection([feature]);
                }

                userinputSelectedEqPeru.description.options = options;
                userinputSelectedEqPeru.description.defaultValue = [Object.values(options)[0]];

                return [userinputSelectedEqPeru];

            default:
                return [];
        }
    }
};
