import { AutorunningProcess, ProcessStateUnavailable, Product, WpsProcess } from 'src/app/wps/wps.datatypes';
import { fragilityRef, } from '../chile/modelProp';
import { exposureRef } from '../chile/exposure';
import { fragilityRefDeusInput, exposureRefDeusInput } from '../chile/deusTranslator';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { laharShakemap } from './lahar';
import { losscategoryEcuador } from './vulnerability';
import { schemaEcuador } from './exposure';
import { WpsData } from '@ukis/services-wps/src/public-api';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { createBarchart, Bardata } from 'src/app/helpers/d3charts';
import { redGreenRange, ninetyPercentLowerThan } from 'src/app/helpers/colorhelpers';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




// export const laharShakemapDeusInput: WpsData & Product = {
//     ...laharShakemap,
//     description: {
//         ...laharShakemap.description,
//         id: 'intensity'
//     },
//     uid: 'deusTranslator_laharShakemap'
// };


// export const LaharDeusTranslator: AutorunningProcess = {
//     uid: 'LaharDeusTranslator',
//     name: 'LaharDeusTranslator',
//     requiredProducts: [fragilityRef, exposureRef, laharShakemap].map(p => p.uid),
//     providedProducts: [fragilityRefDeusInput, exposureRefDeusInput, laharShakemapDeusInput].map(p => p.uid),
//     state: new ProcessStateUnavailable(),
//     onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
//         switch (newProduct.uid) {
//             case fragilityRef.uid:
//                 return [{
//                     ...fragilityRefDeusInput,
//                     value: newProduct.value
//                 }];
//             case exposureRef.uid:
//                 const exposureDeus = {
//                     ...exposureRefDeusInput,
//                     value: newProduct.value
//                 };
//                 delete exposureDeus.description.vectorLayerAttributes; // To avoid displaying exposure on map twice
//                 delete exposureDeus.description.name;
//                 return [exposureDeus];
//             case laharShakemap.uid:
//                 return [{
//                     ... laharShakemapDeusInput,
//                     value: newProduct.value
//                 }];
//             default:
//                 return [];
//         }
//     }
// };



export const laharDamage: VectorLayerData & WpsData & Product = {
    uid: 'lahar_damage',
    description: {
        id: 'damage',
        icon: 'dot-circle',
        reference: false,
        type: 'complex',
        format: 'application/json',
        name: 'damage',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                const [r, g, b] = redGreenRange(0, 50, props.loss_value);
                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.3],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            text: (props: object) => {
                return `<h4>Pérdida ${props['name']}</h4><p>${props['loss_value']} ${props['loss_unit']}</p>`;
            }
        },
        description: 'Concrete damage in USD.'
    },
    value: null
};

export const laharTransition: VectorLayerData & WpsData & Product = {
    uid: 'lahar_transition',
    description: {
        id: 'transition',
        icon: 'dot-circle',
        reference: false,
        type: 'complex',
        format: 'application/json',
        name: 'transition',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();

                const counts = {
                    '4': props.transitions.n_buildings[0],
                    '3': props.transitions.n_buildings[1],
                    '2': props.transitions.n_buildings[2],
                    '1': props.transitions.n_buildings[3],
                };

                const [r, g, b] = redGreenRange(0, 3, ninetyPercentLowerThan(Object.values(counts)));

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.3],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            text: (props: object) => {
                const anchor = document.createElement('div');

                const expo = props['expo'];
                const data: Bardata[] = [
                    {label: '1', value: props['transitions']['n_buildings'][3]},
                    {label: '2', value: props['transitions']['n_buildings'][2]},
                    {label: '3', value: props['transitions']['n_buildings'][1]},
                    {label: '4', value: props['transitions']['n_buildings'][0]}
                ];
                const anchorUpdated = createBarchart(anchor, data, 300, 200, 'estado de daño', 'n. edificios');
                return `<h4>Transiciones ${props['name']}</h4>${anchor.innerHTML}`;
            }
        },
        description: 'Change from previous state to current one'
    },
    value: null
};

export const laharUpdatedExposure: VectorLayerData & WpsData & Product = {
    uid: 'lahar_updated_exposure',
    description: {
        id: 'updated_exposure',
        icon: 'dot-circle',
        reference: false,
        type: 'complex',
        format: 'application/json',
        name: 'updated exposure',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();

                const expo = props.expo;
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0
                };
                for (let i = 0; i < expo.Damage.length; i++) {
                    const damageClass = expo.Damage[i];
                    const nrBuildings = expo.Buildings[i];
                    counts[damageClass] += nrBuildings;
                }

                const [r, g, b] = redGreenRange(0, 4, ninetyPercentLowerThan(Object.values(counts)));

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.3],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            text: (props: object) => {
                const anchor = document.createElement('div');

                const expo = props['expo'];
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0
                };
                for (let i = 0; i < expo.Damage.length; i++) {
                    const damageClass = expo.Damage[i];
                    const nrBuildings = expo.Buildings[i];
                    counts[damageClass] += nrBuildings;
                }
                const data: Bardata[] = [];
                for (const damageClass in counts) {
                    data.push({label: damageClass, value: counts[damageClass]});
                }
                const anchorUpdated = createBarchart(anchor, data, 300, 200, 'estado de daño', '# edificios');
                return `<h4>Exposición actualizada ${props['name']}</h4>${anchor.innerHTML}`;
            }
        },
        description: 'Amount of goods that are exposed to a hazard.'
    },
    value: null
};


export class LaharDeus extends WpsProcess implements WizardableProcess {

    wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'Lahar-DEUS',
            'Multihazard damage estimation / Lahar',
            [schemaEcuador, fragilityRef, laharShakemap, exposureRef].map(p => p.uid),
            [laharDamage, laharTransition, laharUpdatedExposure].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.DeusProcess',
            'This service outputs damage caused by a given lahar.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
        );
        this.wizardProperties = {
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle'
        };
    }

    execute(inputProducts: Product[], outputProducts: Product[], doWhileExecuting): Observable<Product[]> {

        const newInputProducts = inputProducts.map(prod => {
            switch (prod.uid) {
                case fragilityRef.uid:
                    return {
                        ... prod,
                        description: {
                            ... prod.description,
                            id: 'fragility'
                        }
                    };
                case exposureRef.uid:
                    return {
                        ... prod,
                        description: {
                            ... prod.description,
                            id: 'exposure'
                        }
                    };
                case laharShakemap.uid:
                    const complexShakemap: WpsData & Product = {
                        uid: prod.uid,
                        value: prod.value,
                        description: {
                            id: 'intensity',
                            format: 'text/xml',
                            reference: false,
                            type: 'complex'
                        }
                    };
                    return complexShakemap;
                case schemaEcuador.uid:
                    return prod;
            }
        });

        return super.execute(newInputProducts, outputProducts, doWhileExecuting);
    }

}
