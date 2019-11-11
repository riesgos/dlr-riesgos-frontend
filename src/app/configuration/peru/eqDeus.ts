import { WpsProcess, ProcessStateUnavailable, Product, ExecutableProcess, ProcessState } from 'src/app/wps/wps.datatypes';
import { schemaPeru, initialExposurePeru } from './exposure';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { createBarchart, Bardata } from 'src/app/helpers/d3charts';
import { redGreenRange, ninetyPercentLowerThan, toDecimalPlaces, damageRage } from 'src/app/helpers/colorhelpers';
import { HttpClient } from '@angular/common/http';
import { fragilityRefPeru, VulnerabilityModelPeru, assetcategoryPeru, losscategoryPeru, taxonomiesPeru } from './modelProp';
import { eqShakemapRefPeru } from './shakyground';
import { Observable } from 'rxjs';
import { Deus } from '../chile/deus';
import { switchMap } from 'rxjs/operators';




export const lossPeru: WpsData & Product = {
    uid: 'lossPeru',
    description: {
        id: 'loss',
        reference: false,
        type: 'literal'
    },
    value: 'testinputs/loss_sara.json'
};

export const eqDamagePeru: VectorLayerData & WpsData & Product = {
    uid: 'damagePeru',
    description: {
        id: 'damage',
        icon: 'dot-circle',
        reference: false,
        type: 'complex',
        format: 'application/json',
        name: 'eq-damage',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                const [r, g, b] = redGreenRange(0, 1, props.loss_value);
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
                return `<h4>Pérdida ${props['name']}</h4><p>${toDecimalPlaces(props['loss_value'] / 1000000, 2)} M${props['loss_unit']}</p>`;
            }
        },
        description: 'Concrete damage in USD.'
    },
    value: null
};

export const eqTransitionPeru: VectorLayerData & WpsData & Product = {
    uid: 'transitionPeru',
    description: {
        id: 'transition',
        reference: false,
        icon: 'dot-circle',
        type: 'complex',
        format: 'application/json',
        name: 'eq-transition',
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

export const eqUpdatedExposurePeru: VectorLayerData & WpsData & Product = {
    uid: 'updated_exposurePeru',
    description: {
        id: 'updated_exposure',
        reference: false,
        icon: 'dot-circle',
        type: 'complex',
        format: 'application/json',
        name: 'eq-exposure',
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
                let total = 0;
                for (let i = 0; i < expo.Damage.length; i++) {
                    const damageClass = expo.Damage[i];
                    const nrBuildings = expo.Buildings[i];
                    counts[damageClass] += nrBuildings;
                    total += nrBuildings;
                }

                const dr = damageRage(Object.values(counts));

                let r: number;
                let g: number;
                let b: number;
                if (total === 0) {
                    r = b = g = 0;
                } else {
                    [r, g, b] = redGreenRange(0, 1, dr);
                }

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

export const eqUpdatedExposureRefPeru: WpsData & Product = {
    uid: 'updated_exposure_ref_peru',
    description: {
        id: 'updated_exposure',
        reference: true,
        type: 'complex',
        format: 'application/json',
        description: 'Amount of goods that are exposed to a hazard.'
    },
    value: null
};



export class EqDeusPeru implements ExecutableProcess, WizardableProcess {

    readonly state: ProcessState;
    readonly uid: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly description?: string;
    readonly wizardProperties: WizardProperties;

    private vulnerabilityProcess: VulnerabilityModelPeru;
    private deusProcess: Deus;

    constructor(http: HttpClient) {
        this.state = new ProcessStateUnavailable();
        this.uid = 'EQ-Deus';
        this.name = 'Multihazard damage estimation / EQ';
        this.requiredProducts = [eqShakemapRefPeru, initialExposurePeru].map(p => p.uid);
        this.providedProducts = [eqDamagePeru, eqTransitionPeru, eqUpdatedExposurePeru, eqUpdatedExposureRefPeru].map(p => p.uid);
        this.description = 'This service outputs damage caused by a given earthquake.';
        this.wizardProperties = {
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle' as 'dot-circle'
        };

        this.vulnerabilityProcess = new VulnerabilityModelPeru(http);
        this.deusProcess = new Deus(http);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const vulnerabilityInputs = [
            assetcategoryPeru,
            losscategoryPeru,
            taxonomiesPeru,
            {
                ... schemaPeru,
                value: 'SARA_v1.0'
            }
        ];
        const vulnerabilityOutputs = [fragilityRefPeru];

        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {
                    const fragility = resultProducts.find(prd => prd.uid === fragilityRefPeru.uid);
                    const shakemap = inputProducts.find(prd => prd.uid === eqShakemapRefPeru.uid);
                    const exposure = inputProducts.find(prd => prd.uid === initialExposurePeru.uid);

                    const deusInputs = [{
                            ... schemaPeru,
                            value: 'SARA_v1.0'
                        }, {
                            ... fragility,
                            description: {
                                ... fragility.description,
                                id: 'fragility'
                            }
                        }, {
                            ... shakemap,
                            description: {
                                ...shakemap.description,
                                id: 'intensity'
                            }
                        }, {
                            ... exposure,
                            description: {
                                ... exposure.description,
                                id: 'exposure'
                            },
                            value: exposure.value[0]
                        }
                    ];
                    const deusOutputs = outputProducts;
                    return this.deusProcess.execute(deusInputs, deusOutputs, doWhileExecuting);
                })
            );
    }
}
