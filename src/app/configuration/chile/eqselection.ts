import { UserconfigurableWpsData, FeatureSelectUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WatchingProcess, ProcessStateTypes, Product, CustomProcess } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { Feature } from '@turf/helpers';
import { Observable, of } from 'rxjs';
import { WpsActions } from 'src/app/wps/wps.actions';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { featureCollection } from '@turf/helpers';
import { convertWpsDataToProds } from 'src/app/wps/wps.selectors';



export const selectedRow: FeatureSelectUconfWpsData = {
    description: {
        id: 'selectedRow',
        sourceProcessId: 'user',
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


export const selectedEq: VectorLayerData = {
    description: {
        id: 'quakeMLFile',
        sourceProcessId: 'EqSelection',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
        name: 'Selected EQ',
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
        }
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
        const eqVal = inputs.find(i => i.description.id === 'selectedRow').value;
        const eqValFeatureCollection = featureCollection([eqVal]);
        return of([{
            ...selectedEq,
            value: [eqValFeatureCollection]
        }]);
    },

    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.description.id) {

            case 'selectedRows':

                const options = {};
                for (const feature of newProduct.value[0].features) {
                    options[feature.id] = feature;
                }

                return convertWpsDataToProds([{
                    description: {
                        id: 'selectedRow',
                        sourceProcessId: 'EqSelection',
                        options: options,
                        reference: false,
                        type: 'complex',
                        wizardProperties: {
                            fieldtype: 'select',
                            name: 'Selected EQ'
                        }
                    },
                    value: null
                }]);


            default:
                return [];
        }
    }
};
