import { FeatureSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { ProductTransformingProcess, ProcessStateTypes, Product, ExecutableProcess } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'src/app/services/wps';
import { Observable, of } from 'rxjs';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import { selectedEqs } from './quakeledger';
import { FeatureCollection, featureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import Geometry from 'ol/geom/Geometry';



export const userinputSelectedEq: FeatureSelectUconfProduct = {
    uid: 'eq_selectedRow',
    description: {
        featureSelectionOptions: {},
        defaultValue: null,
        wizardProperties: {
            fieldtype: 'select',
            name: 'SelectedEQ',
            description: 'SelectEQ'
        }
    },
    value: null
};


export const selectedEq: WpsData & VectorLayerProduct = {
    uid: 'EqSelection_quakeMLFile',
    description: {
        id: 'quakeMLFile',
        title: '',
        name: 'Selected_earthquake',
        icon: 'earthquake',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
                return new olStyle({
                    image: new olCircle({
                        radius: 20,
                        fill: new olFill({
                            color: 'blue'
                        }),
                        stroke: new olStroke({
                            color: 'white',
                            width: 1
                        })
                    })
                });
            },
            text: (properties: object) => {
                let text = `<h3>{{ Selected_earthquake }}</h3>`;
                const selectedProperties = {
                    '{{ Magnitude }}': toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                    '{{ Depth }}': toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km',
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
    },
    value: null
};



export const EqSelection: WizardableProcess & ExecutableProcess & ProductTransformingProcess = {
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

    /**
     * From all possible values in `userinputSelectedEq` the user selects one.
     * We use this selection as the value for `selectedEq`.
     */
    execute: (inputs: Product[]): Observable<Product[]> => {
        const eqVal = inputs.find(i => i.uid === userinputSelectedEq.uid).value;
        return of([{
            ...selectedEq,
            value: eqVal
        }]);
    },

    /**
     * Wait for eq-catalogue to return its data (`selectedEqs`)
     * Once they are available, use those values as selectable options for `userinputSelectedEq`
     */
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {

            case selectedEqs.uid:
                const options: {[key: string]: FeatureCollection} = {};
                for (const feature of newProduct.value[0].features) {
                    options[feature.id] = featureCollection([feature]);
                }

                userinputSelectedEq.description.featureSelectionOptions = options;
                userinputSelectedEq.description.defaultValue = [Object.values(options)[0]];

                return [userinputSelectedEq];

            default:
                return [];
        }
    }
};
