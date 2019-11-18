import { FeatureSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { AutorunningProcess, ProcessStateTypes, Product, ExecutableProcess } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { Observable, of } from 'rxjs';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { selectedEqs } from './quakeledger';
import { FeatureCollection, featureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';



export const userinputSelectedEq: FeatureSelectUconfProduct & VectorLayerData & WpsData = {
    uid: 'eq_selectedRow',
    description: {
        id: 'selectedRow',
        icon: 'earthquake',
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
            text: (properties: object) => {
                let text = `<h3>Terremoto elegido</h3>`;
                const selectedProperties = {
                    Magnitud: toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                    Profundidad: toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km',
                    // Latitude: toDecimalPlaces(1, 1),
                    // Longitude: toDecimalPlaces(2, 1),
                    Id: properties['origin.publicID'],
                };
                text += '<table class="table"><tbody>';
                for (const property in selectedProperties) {
                    if (selectedProperties[property]) {
                        const propertyValue = selectedProperties[property];
                        text += `<tr><td>${property}</td> <td>${propertyValue}</td></tr>`;
                    }
                }
                text += '</tbody></table>';
                return text;
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



export const EqSelection: WizardableProcess & ExecutableProcess & AutorunningProcess = {
    uid: 'EqSelection',
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
        const eqVal = inputs.find(i => i.uid === userinputSelectedEq.uid).value;
        return of([{
            ...selectedEq,
            value: eqVal
        }]);
    },

    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {

            case selectedEqs.uid:
                const options = {};
                for (const feature of newProduct.value[0].features) {
                    options[feature.id] = featureCollection([feature]);
                }

                userinputSelectedEq.description.options = options;
                userinputSelectedEq.description.defaultValue = [Object.values(options)[0]];

                return [userinputSelectedEq];

            default:
                return [];
        }
    }
};
