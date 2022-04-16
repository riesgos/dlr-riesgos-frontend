import { FeatureSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { ProductTransformingProcess, ProcessStateTypes, Product, ExecutableProcess } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { Observable, of } from 'rxjs';
import { VectorLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import { availableEqs } from './quakeledger';
import { FeatureCollection, featureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import Geometry from 'ol/geom/Geometry';
import { InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';



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
              },
              summary: (value) => {
                const feature = value.features[0];
                const properties = feature.properties;
                const magnitude = toDecimalPlaces(properties['magnitude.mag.value'] as number, 1);
                const depth = toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km';
                const id = properties['origin.publicID'];

                return {
                    component: InfoTableComponentComponent,
                    inputs: {
                        title: 'Selected earthquake',
                        data: [
                            [{ value: 'Id'}, { value: id }],
                            [{ value: 'Magnitude'}, { value: magnitude }],
                            [{ value: 'Depth'}, { value: depth }],
                        ]
                    }
                };
            }
        },
    },
    value: null
};



export const EqSelection: WizardableProcess & ExecutableProcess & ProductTransformingProcess = {
    uid: 'EqSelection',
    name: 'Select earthquake',
    description: 'select_eq_description',
    state: { type: ProcessStateTypes.unavailable },
    requiredProducts: [availableEqs, userinputSelectedEq].map(p => p.uid),
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


    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {

            // Wait for eq-catalogue to return its data (`selectedEqs`)
            // Once they are available, use those values as selectable options for `userinputSelectedEq`
            case availableEqs.uid:
                const options: {[key: string]: FeatureCollection} = {};
                for (const feature of newProduct.value[0].features) {
                    const key = getEqKey(feature);
                    options[key] = featureCollection([feature]);
                }

                userinputSelectedEq.description.featureSelectionOptions = options;
                userinputSelectedEq.description.defaultValue = [Object.values(options)[0]];

                return [userinputSelectedEq];

            // wait for user to have selected an eq.
            // when selection is made, update the styling of the available eqs
            case userinputSelectedEq.uid:
                const selectedEqId = newProduct.value[0].features[0].id;
                const eqsData = allProducts.find(p => p.uid === availableEqs.uid);
                const allFeatures = eqsData.value[0].features;
                for (const feature of allFeatures) {
                    if (feature.id === selectedEqId) {
                        feature.properties.selected = true;
                    } else {
                        feature.properties.selected = false;
                    }
                }
                return [eqsData];

            default:
                return [];
        }
    }
};

function getEqKey(feature) {
    const key = `Mag. ${feature.properties['magnitude.mag.value']} / ID ${feature.id.replace('quakeml:quakeledger/', '')}`;
    return key;
}