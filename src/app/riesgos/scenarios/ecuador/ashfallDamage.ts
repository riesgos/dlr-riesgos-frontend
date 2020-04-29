import { ExecutableProcess, Product, ProcessState, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VulnerabilityModelEcuador, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './vulnerability';
import { Volcanus } from './volcanus';
import { switchMap } from 'rxjs/operators';
import { ashfallPoint } from './ashfallService';
import { WpsData, WpsDataDescription } from '@dlr-eoc/services-ogc';
import { VectorLayerProduct, MultiVectorLayerProduct, VectorLayerProperties } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { schemaEcuador, initialExposureAshfallRef } from './exposure';
import { FeatureCollection } from '@turf/helpers';
import { fragilityRef } from '../chile/modelProp';
import { Bardata, createBarchart } from 'src/app/helpers/d3charts';
import { weightedDamage, greenRedRange, toDecimalPlaces, ninetyPercentLowerThan } from 'src/app/helpers/colorhelpers';
import { createHeaderTableHtml, createTableHtml, createKeyValueTableHtml } from 'src/app/helpers/others';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';




const ashfallDamageProps: VectorLayerProperties = {
        name: 'ashfallDamage',
        icon: 'volcanoe',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                const [r, g, b] = greenRedRange(0, 1, props.loss_value / 1000000);
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
                    'type': 'Feature',
                    'properties': {'loss_value': 500000},
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 500.000 USD'
            }],
            text: (props: object) => {
                return `<h4>Loss </h4><p>${toDecimalPlaces(props['loss_value'] / 1000000, 2)} M${props['loss_unit']}</p>`;
            },
            summary: (value: [FeatureCollection]) => {
                const features = value[0].features;
                const damages = features.map(f => f.properties['loss_value']);
                const totalDamage = damages.reduce((carry, current) => carry + current, 0);
                const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 0) + ' MUSD';
                return createKeyValueTableHtml('', {'total damage': totalDamageFormatted});
            }
        }
};

const ashfallTransitionProps: VectorLayerProperties = {
        name: 'ashfallTransition',
        icon: 'volcanoe',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();

                const counts = Array(4).fill(0);
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
                    [r, g, b] = greenRedRange(0, 4, ninetyPercentLowerThan(Object.values(counts)));
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
            legendEntries: [{
                feature: {
                    'type': 'Feature',
                    'properties': {'transitions': {'n_buildings': 100, 'to_damage_state': [10, 80, 10]}},
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Transiciónes'
            }],
            text: (props: object) => {

                const matrix = Array.from(Array(4), _ => Array(4).fill(0));
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
                const matrix = Array.from(Array(4), _ => Array(4).fill(0));
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
        }

};

const ashfallUpdatedExposureProps: VectorLayerProperties = {
        name: 'ashfallExposure',
        icon: 'volcanoe',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();

                const expo = props.expo;
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0
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
                    'type': 'Feature',
                    'properties': {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3'], 'Buildings': [10, 80, 80, 10]}},
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Damage states'
            }],
            text: (props: object) => {
                const anchor = document.createElement('div');

                const expo = props['expo'];
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0
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
                return `<h4>Updated exposure </h4>${anchor.innerHTML}`;
            },
            summary: (value: [FeatureCollection]) => {
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0
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
        }
};

export const ashfallDamageM: WpsData & MultiVectorLayerProduct = {
    uid: 'ashfall_damage_output_values',
    description: {
        id: 'merged_output',
        reference: false,
        defaultValue: null,
        format: 'application/json',
        type: 'complex',
        description: '',
        vectorLayers: [ashfallUpdatedExposureProps, ashfallDamageProps]
    },
    value: null
};

export const ashfallUpdatedExposureRef: WpsData & Product = {
    uid: 'ashfallExposureRef',
    description: {
        id: 'updated_exposure',
        reference: true,
        type: 'complex',
        format: 'application/json'
    },
    value: null
};


export class DeusAshfall implements ExecutableProcess, WizardableProcess {

    readonly uid: string = 'DeusAshfall';
    readonly name: string = 'Ashfall Damage';
    readonly state: ProcessState = new ProcessStateUnavailable();
    readonly requiredProducts: string[] =
        [initialExposureAshfallRef, ashfallPoint].map(p => p.uid);
    readonly providedProducts: string[] =
        [ashfallDamageM, ashfallUpdatedExposureRef].map(p => p.uid);
    readonly description?: string = 'Deus Ashfall description';
    readonly wizardProperties: WizardProperties = {
        shape: 'dot-circle',
        providerName: 'Helmholtz Centre Potsdam',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    };

    private volcanus: Volcanus;
    private vulnerability: VulnerabilityModelEcuador;

    constructor(http: HttpClient, cache) {
        this.volcanus = new Volcanus(http, cache);
        this.vulnerability = new VulnerabilityModelEcuador(http, cache);
    }

    execute(
        inputs: Product[], outputs?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void
    ): Observable<Product[]> {

        const vulnInputs = [{
            ... schemaEcuador,
            value: 'Torres_Corredor_et_al_2017'
        }, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador];
        const vulnOutputs = [fragilityRef];

        return this.vulnerability.execute(vulnInputs, vulnOutputs, doWhileExecuting).pipe(
            switchMap((results: Product[]) => {
                const fragility = results.find(prd => prd.uid === fragilityRef.uid);
                const shakemap = inputs.find(prd => prd.uid === ashfallPoint.uid);
                const exposure = inputs.find(prd => prd.uid === initialExposureAshfallRef.uid);

                const vulcInputs: Product[] = [{
                    ... shakemap,
                    description: {
                        ... shakemap.description as WpsDataDescription,
                        id: 'intensity'
                    },
                    value: shakemap.value[0]
                }, {
                    uid: 'intensitycolumn',
                    description: {
                        id: 'intensitycolumn',
                        type: 'literal',
                        reference: false
                    },
                    value: 'load'
                }, {
                    ... exposure,
                    description: {
                        ... exposure.description,
                        id: 'exposure'
                    },
                }, {
                    ... schemaEcuador,
                    value: 'Torres_Corredor_et_al_2017',
                }, {
                    ... fragility,
                    description: {
                        ... fragility.description,
                        id: 'fragility'
                    }
                }];

                const vulcOutputs: Product[] = [ashfallDamageM, ashfallUpdatedExposureRef];

                return this.volcanus.execute(vulcInputs, vulcOutputs, doWhileExecuting);
            })
        );
    }
}
