import { FeatureSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { ProductTransformingProcess, ProcessStateTypes, Product, ExecutableProcess } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'src/app/services/wps';
import { Observable, of } from 'rxjs';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import { selectedEqsPeru } from './quakeledger';
import { FeatureCollection, featureCollection } from '@turf/helpers';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import Geometry from 'ol/geom/Geometry';



export const userinputSelectedEqPeru: FeatureSelectUconfProduct & VectorLayerProduct & WpsData = {
    uid: 'selectedRowPeru',
    description: {
        id: 'selectedRow',
        title: 'selectedRow',
        icon: 'earthquake',
        featureSelectionOptions: {},
        defaultValue: null,
        reference: false,
        type: 'complex',
        format: 'application/vnd.geo+json',
        name: 'Selected_earthquake',
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
        wizardProperties: {
            fieldtype: 'select',
            name: 'SelectedEQ',
            description: 'SelectEQ'
        }
    },
    value: null
};


export const selectedEqPeru: WpsData & Product = {
    uid: 'EqSelection_quakeMLFilePeru',
    description: {
        id: 'quakeMLFile',
        title: '',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex'
    },
    value: null
};



export const EqSelectionPeru: WizardableProcess & ExecutableProcess & ProductTransformingProcess = {
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
                const options: {[key: string]: FeatureCollection} = {};
                for (const feature of newProduct.value[0].features) {
                    options[feature.id] = featureCollection([feature]);
                }

                userinputSelectedEqPeru.description.featureSelectionOptions = options;
                userinputSelectedEqPeru.description.defaultValue = [Object.values(options)[0]];

                return [userinputSelectedEqPeru];

            default:
                return [];
        }
    }
};
