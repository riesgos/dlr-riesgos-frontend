import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { WpsData } from '@dlr-eoc/services-ogc';
import { Product, ProcessStateUnavailable, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { redGreenRange, ninetyPercentLowerThan, toDecimalPlaces, greenRedRange, weightedDamage } from 'src/app/helpers/colorhelpers';
import { Bardata, createBarchart } from 'src/app/helpers/d3charts';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { eqUpdatedExposureRef } from './eqDeus';
import { schema } from './exposure';
import { tsShakemap } from './tsService';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { fragilityRef, VulnerabilityModel, assetcategory, losscategory, taxonomies } from './modelProp';
import { Observable } from 'rxjs';
import { Deus } from './deus';
import { switchMap } from 'rxjs/operators';
import { FeatureCollection } from '@turf/helpers';
import { createKeyValueTableHtml, createHeaderTableHtml, createTableHtml } from 'src/app/helpers/others';
import { Cache } from '@dlr-eoc/services-ogc';


export const tsDamage: VectorLayerProduct & WpsData & Product = {
    uid: 'ts_damage',
    description: {
        id: 'damage',
        reference: false,
        icon: 'dot-circle',
        type: 'complex',
        format: 'application/json',
        name: 'ts-damage',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                const [r, g, b] = greenRedRange(0, 1, props.loss_value / 1000000 );
                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": {'loss_value': 100000},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 100.000 USD'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'loss_value': 500000},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 500.000 USD'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'loss_value': 1000000},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 1000.000 USD'
            }],
            text: (props: object) => {
                return `<h4>Loss </h4><p>${toDecimalPlaces(props['loss_value'] / 1000000, 2)} M${props['loss_unit']}</p>`;
            },
            summary: (value: [FeatureCollection]) => {
                const features = value[0].features;
                const damages = features.map(f => f.properties['loss_value']);
                const totalDamage = damages.reduce((carry, current) => carry + current, 0);
                const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 2) + ' MUSD';
                return createKeyValueTableHtml('', {'total damage': totalDamageFormatted});
            }
        },
        description: 'Concrete damage in USD.'
    },
    value: null
};

export const tsTransition: VectorLayerProduct & WpsData & Product = {
    uid: 'ts_transition',
    description: {
        id: 'transition',
        icon: 'dot-circle',
        reference: false,
        type: 'complex',
        format: 'application/json',
        name: 'ts-transition',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();

                const counts = Array(7).fill(0);
                let total = 0;
                const nrBuildings = props['transitions']['n_buildings'];
                const states = props['transitions']['to_damage_state'];
                for (let i = 0; i < states.length; i++) {
                    const nr = nrBuildings[i];
                    const state = states[i];
                    counts[state] += nr;
                    total += nr;
                }

                let r; let g; let b;
                if (total > 0) {
                    [r, g, b] = greenRedRange(0, 7, ninetyPercentLowerThan(Object.values(counts)));
                } else {
                    r = g = b = 0;
                }

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            text: (props: object) => {

                const matrix = Array.from(Array(7), _ => Array(7).fill(0));
                const fromDamageState = props['transitions']['from_damage_state'];
                const nrBuildings = props['transitions']['n_buildings'];
                const toDamageState = props['transitions']['to_damage_state'];
                for (let i = 0; i < fromDamageState.length; i++) {
                    const r = fromDamageState[i];
                    const c = toDamageState[i];
                    const nr = nrBuildings[i];
                    matrix[r][c] += nr;
                }

                const labeledMatrix = Array.from(Array(matrix.length + 1), _ => Array(matrix.length + 1).fill(''));
                for (let r = 0; r < labeledMatrix.length; r++) {
                    for (let c = 0; c < labeledMatrix[0].length; c++) {
                        if (r === 0 && c === 0) {
                            labeledMatrix[r][c] = '<b>from\\to</b>';
                        } else if (r === 0) {
                            labeledMatrix[r][c] = `<b>${c - 1}</b>`;
                        } else if (c === 0) {
                            labeledMatrix[r][c] = `<b>${r - 1}</b>`;
                        } else if (r > 0 && c > 0) {
                            labeledMatrix[r][c] = toDecimalPlaces(matrix[r-1][c-1], 2);
                        }
                    }
                }

                return `<h4>Transitions </h4>${createTableHtml(labeledMatrix)}`;
            },
            summary: (value: [FeatureCollection]) => {
                const matrix = Array.from(Array(7), _ => Array(7).fill(0));
                for (const feature of value[0].features) {
                    const fromDamageState = feature.properties['transitions']['from_damage_state'];
                    const nrBuildings = feature.properties['transitions']['n_buildings'];
                    const toDamageState = feature.properties['transitions']['to_damage_state'];
                    for (let i = 0; i < fromDamageState.length; i++) {
                        const r = fromDamageState[i];
                        const c = toDamageState[i];
                        const nr = nrBuildings[i];
                        matrix[r][c] += nr;
                    }
                }
                
                const labeledMatrix = Array.from(Array(matrix.length + 1), _ => Array(matrix.length + 1).fill(''));
                for (let r = 0; r < labeledMatrix.length; r++) {
                    for (let c = 0; c < labeledMatrix[0].length; c++) {
                        if (r === 0 && c === 0) {
                            labeledMatrix[r][c] = '<b>from\\to</b>';
                        } else if (r === 0) {
                            labeledMatrix[r][c] = `<b>${c - 1}</b>`;
                        } else if (c === 0) {
                            labeledMatrix[r][c] = `<b>${r - 1}</b>`;
                        } else if (r > 0 && c > 0) {
                            labeledMatrix[r][c] = toDecimalPlaces(matrix[r-1][c-1], 0);
                        }
                    }
                }

                return createTableHtml(labeledMatrix);
            }
        },
        description: 'Change from previous state to current one'
    },
    value: null
};

export const tsUpdatedExposure: VectorLayerProduct & WpsData & Product = {
    uid: 'ts_updated_exposure',
    description: {
        id: 'updated_exposure',
        icon: 'dot-circle',
        reference: false,
        type: 'complex',
        format: 'application/json',
        name: 'ts-exposure',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();

                const expo = props.expo;
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0,
                    'D5': 0,
                    'D6': 0
                };
                let total = 0;
                for (let i = 0; i < expo.Damage.length; i++) {
                    const damageClass = expo.Damage[i];
                    const nrBuildings = expo.Buildings[i];
                    counts[damageClass] += nrBuildings;
                    total += nrBuildings;
                }

                const dr = weightedDamage(Object.values(counts));

                let r: number;
                let g: number;
                let b: number;
                if (total === 0) {
                    r = b = g = 0;
                } else {
                    [r, g, b] = greenRedRange(0, 0.6, dr);
                }

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    witdh: 2
                  })
                });
            },
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3', 'D4', 'D5'], 'Buildings': [90, 10, 0, 0, 0, 0]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Damage states: 90/10/0/0/0/0'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3', 'D4', 'D5'], 'Buildings': [0, 10, 40, 40, 10, 0]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Damage states: 0/10/40/40/10/0'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3', 'D4', 'D5'], 'Buildings': [0, 0, 0, 0, 20, 80]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Damage states: 0/0/0/0/20/80'
            }],
            text: (props: object) => {
                const anchor = document.createElement('div');

                const expo = props['expo'];
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0,
                    'D5': 0,
                    'D6': 0
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
                const anchorUpdated = createBarchart(anchor, data, 300, 200, 'Damage state', '# buildings');
                
                const legend = `
                    <ul>
                        <li><b>D0:</b> no damage</li>
                        <li><b>D1:</b> minor damage</li>
                        <li><b>D2:</b> moderate damage</li>
                        <li><b>D3:</b> major damage</li>
                        <li><b>D4:</b> complete damage</li>
                        <li><b>D5:</b> collapsed</li>
                        <li><b>D6:</b> washed away</li>
                    </ul>
                `;

                return `<h4>Updated exposure</h4>${anchor.innerHTML}<br/>${legend}`;
            },
            summary: (value: [FeatureCollection]) => {
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0,
                    'D5': 0,
                    'D6': 0
                };
                for (const feature of value[0].features) {
                    for (let i = 0; i < feature.properties.expo.Damage.length; i++) {
                        const damageClass = feature.properties.expo.Damage[i];
                        const nrBuildings = feature.properties.expo.Buildings[i];
                        counts[damageClass] += nrBuildings;
                    }
                }
                return createHeaderTableHtml(Object.keys(counts), [Object.values(counts).map(c => toDecimalPlaces(c, 0))]);
            }
        },
        description: 'Amount of goods that are exposed to a hazard.'
    },
    value: null
};





export class TsDeus implements ExecutableProcess, WizardableProcess {

    readonly state: ProcessState;
    readonly uid: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly description?: string;
    readonly wizardProperties: WizardProperties;

    private vulnerabilityProcess: VulnerabilityModel;
    private deusProcess: Deus;

    constructor(http: HttpClient, cache: Cache) {
        this.state = new ProcessStateUnavailable();
        this.uid = 'TS-Deus';
        this.name = 'Multihazard damage estimation / TS';
        this.requiredProducts = [tsShakemap, eqUpdatedExposureRef].map(p => p.uid);
        this.providedProducts = [tsDamage, tsTransition, tsUpdatedExposure].map(p => p.uid);
        this.description = 'This service returns damage caused by the selected tsunami.';
        this.wizardProperties = {
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle',
            wikiLink: 'Vulnerability'
        };

        this.vulnerabilityProcess = new VulnerabilityModel(http, cache);
        this.deusProcess = new Deus(http, cache);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const vulnerabilityInputs = [
            assetcategory,
            losscategory,
            taxonomies,
            {
                ... schema,
                value: 'SUPPASRI2013_v2.0'
            }
        ];
        const vulnerabilityOutputs = [fragilityRef];

        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {

                    const fragility = resultProducts.find(prd => prd.uid === fragilityRef.uid);
                    const shakemap = inputProducts.find(prd => prd.uid === tsShakemap.uid);
                    const exposure = inputProducts.find(prd => prd.uid === eqUpdatedExposureRef.uid);

                    const deusInputs = [{
                            ... schema,
                            value:  'SARA_v1.0' // <-- because last exposure still used SARA!
                        }, {
                            ... fragility,
                            description: {
                                ... fragilityRef.description,
                                id: 'fragility'
                            }
                        }, {
                            ... shakemap,
                            description: {
                                ...shakemap.description,
                                format: 'text/xml',
                                id: 'intensity'
                            }
                        }, {
                            ... exposure,
                            description: {
                                ... exposure.description,
                                id: 'exposure'
                            },
                        }
                    ];
                    const deusOutputs = outputProducts;
                    return this.deusProcess.execute(deusInputs, deusOutputs, doWhileExecuting);
                })
            );
    }
}
