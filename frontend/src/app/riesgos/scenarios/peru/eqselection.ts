import { FeatureSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { ProductTransformingProcess, ProcessStateTypes, Product, ExecutableProcess } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { Observable, of } from 'rxjs';
import { VectorLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import { availableEqsPeru, etypePeru } from './quakeledger';
import { FeatureCollection, featureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import Geometry from 'ol/geom/Geometry';
import { InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';



export const userinputSelectedEqPeru: FeatureSelectUconfProduct = {
    uid: 'selectedRowPeru',
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


export const selectedEqPeru: WpsData & VectorLayerProduct = {
    uid: 'EqSelection_quakeMLFilePeru',
    description: {
        id: 'quakeMLFile',
        title: '',
        name: 'Selected_earthquake',
        icon: 'earthquake',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
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
            detailPopupHtml: (properties: object) => {
                let text = `<h3>{{ Selected_earthquake }}</h3>`;
                const selectedProperties = {
                    '{{ Magnitude }}': toDecimalPlaces(properties['magnitude.mag.value'] as number, 1),
                    '{{ Depth }}': toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km',
                    // Latitude: toDecimalPlaces(1, 1),
                    // Longitude: toDecimalPlaces(2, 1),
                    Id: properties['origin.publicID'],
                };
                if (properties['origin.time.value']) {
                    const date = new Date(Date.parse(properties['origin.time.value']));
                    selectedProperties['{{ Date }}'] = `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
                }
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
              globalSummary: (value) => {
                const feature = value.features[0];
                const properties = feature.properties;
                const magnitude = toDecimalPlaces(properties['magnitude.mag.value'] as number, 1);
                const depth = toDecimalPlaces(properties['origin.depth.value'] as number, 1) + ' km';
                const id = properties['origin.publicID'];

                const data = [
                    [{ value: 'Id'}, { value: id }],
                    [{ value: 'Magnitude'}, { value: magnitude }],
                    [{ value: 'Depth'}, { value: depth }],
                ];

                if (properties['origin.time.value']) {
                    const date = new Date(Date.parse(properties['origin.time.value']));
                    data.push([{value: 'Date'}, {value: `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`}]);
                }

                return {
                    component: InfoTableComponentComponent,
                    inputs: { data: data }
                };
            }
        },
    },
    value: null
};



export const EqSelectionPeru: WizardableProcess & ExecutableProcess & ProductTransformingProcess = {
    uid: 'EqSelectionPeru',
    name: 'Select earthquake',
    description: 'select_eq_description',
    state: { type: ProcessStateTypes.unavailable },
    requiredProducts: [availableEqsPeru, userinputSelectedEqPeru].map(p => p.uid),
    providedProducts: [selectedEqPeru.uid],
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
        const eqVal = inputs.find(i => i.uid === userinputSelectedEqPeru.uid).value;
        return of([{
            ...selectedEqPeru,
            value: eqVal
        }]);
    },

    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {

            // Wait for eq-catalogue to return its data (`selectedEqs`)
            // Once they are available, use those values as selectable options for `userinputSelectedEq`
            case availableEqsPeru.uid:
                const options: {[key: string]: FeatureCollection} = {};
                for (const feature of newProduct.value[0].features) {
                    const key = getEqKey(feature);
                    options[key] = featureCollection([feature]);
                }

                userinputSelectedEqPeru.description.featureSelectionOptions = options;
                userinputSelectedEqPeru.description.defaultValue = [Object.values(options)[0]];

                return [userinputSelectedEqPeru];

            // wait for user to have selected an eq.
            // when selection is made, update the styling of the available eqs
            case userinputSelectedEqPeru.uid:
                const selectedEqId = newProduct.value[0].features[0].id;
                const eqsData = allProducts.find(p => p.uid === availableEqsPeru.uid);
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
