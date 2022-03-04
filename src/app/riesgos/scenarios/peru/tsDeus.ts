import { MultiVectorLayerProduct, VectorLayerProduct, VectorLayerProperties } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { WpsData, Cache } from 'src/app/services/wps';
import { Product, ProcessStateUnavailable, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { toDecimalPlaces, greenRedRange, weightedDamage, yellowBlueRange } from 'src/app/helpers/colorhelpers';
import { BarData, createGroupedBarChart } from 'src/app/helpers/d3charts';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { eqDamagePeruM, eqUpdatedExposureRefPeru } from './eqDeus';
import { tsShakemapPeru } from './tsService';
import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import olFeature from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { fragilityRefPeru, VulnerabilityModelPeru } from './modelProp';
import { Observable } from 'rxjs';
import { Deus } from '../chile/deus';
import { map, switchMap } from 'rxjs/operators';
import { FeatureCollection } from '@turf/helpers';
import { createHeaderTableHtml, createTableHtml, zeros, filledMatrix } from 'src/app/helpers/others';
import { InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';
import { IDynamicComponent } from 'src/app/components/dynamic-component/dynamic-component.component';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';
import { maxDamage$ } from '../chile/constants';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import Geometry from 'ol/geom/Geometry';

export const schemaPeru: StringSelectUserConfigurableProduct & WpsData = {
    uid: 'schema',
    description: {
      id: 'schema',
      title: 'schema',
      defaultValue: 'SUPPASRI2013_v2.0',
      reference: false,
      type: 'literal',
      wizardProperties: {
          fieldtype: 'stringselect',
          name: 'schema',
          description: '',
        },
        options: [
            'SUPPASRI2013_v2.0',
            'Medina_2019',
        ],
    },
    value: 'SUPPASRI2013_v2.0'
};

export const tsDamagePeruProperties: VectorLayerProperties = {
        icon: 'dot-circle',
        name: 'ts-damage',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
                const props = feature.getProperties();
                const [r, g, b] = greenRedRange(0, 1, props.loss_value / maxDamage$ );
                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    width: 2
                  })
                });
            },
            legendEntries: [{
                feature: {
                    'type': 'Feature',
                    'properties': {'loss_value': 100000},
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 100000 USD'
            }, {
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
                text: 'Loss 500000 USD'
            }, {
                feature: {
                    'type': 'Feature',
                    'properties': {'loss_value': 1000000},
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Loss 1000000 USD'
            }],
            text: (props: object) => {
                return `<h4>{{ Loss }}</h4><p>${toDecimalPlaces(props['loss_value'] / 1000000, 2)} M${props['loss_unit']}</p>`;
            },
            summary: (value: FeatureCollection | FeatureCollection[]) => {
                let features;
                if (Array.isArray(value)) {
                    features = value[0].features;
                } else {
                    features = value.features;
                }
                const damages = features.map(f => f.properties['loss_value']);
                const totalDamage = damages.reduce((carry, current) => carry + current, 0);
                const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 2) + ' MUSD';

                return {
                    component: InfoTableComponentComponent,
                    inputs: {
                        title: 'Total damage',
                        data: [[{ value: 'Total damage'}, { value: totalDamageFormatted }]]
                    }
                };
            }
        },
        description: 'Damage in USD'
};

const tsTransitionPeruProperties: VectorLayerProperties = {
        icon: 'dot-circle',
        name: 'ts-transition',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number, selected: boolean) => {
                const props = feature.getProperties();

                const I = props['transitions']['n_buildings'].length;
                const total = props['transitions']['n_buildings'].reduce((v, c) => v + c, 0);

                const toStates = props['transitions']['to_damage_state'];
                const fromStates = props['transitions']['from_damage_state'];
                const nrBuildings = props['transitions']['n_buildings'];

                let sumTo = 0;
                let sumFrom = 0;
                let sumBuildings = 0;
                for (let i = 0; i < I; i++) {
                    sumBuildings += nrBuildings[i];
                    sumTo += toStates[i] * nrBuildings[i];
                    sumFrom += fromStates[i] * nrBuildings[i];
                }
                const meanStateFrom = sumFrom / sumBuildings;
                const meanStateTo = sumTo / sumBuildings;

                const weightedChange = (meanStateTo - meanStateFrom) / (7 - meanStateFrom);

                let r; let g; let b;
                if (total > 0) {
                    [r, g, b] = yellowBlueRange(0, 1, weightedChange);
                } else {
                    r = b = g = 160;
                }

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    width: 2
                  })
                });
            },
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": { 'transitions': { 'n_buildings': [100], 'from_damage_state': [0, 0, 0, 0, 0, 0, 0], 'to_damage_state': [90, 10, 0, 0, 0, 0] } },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [5.627918243408203, 50.963075942052164],
                            [5.627875328063965, 50.958886259879264],
                            [5.635471343994141, 50.95634523633128],
                            [5.627918243408203, 50.963075942052164]]]
                    }
                },
                text: `SmallDamageChange`,
            }, {
                feature: {
                    "type": "Feature",
                    "properties": { 'transitions': { 'n_buildings': [100], 'from_damage_state': [0, 0, 0, 0, 0, 0, 0], 'to_damage_state': [0, 0, 0, 0, 0, 10, 90] } },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [5.627918243408203, 50.963075942052164],
                            [5.627875328063965, 50.958886259879264],
                            [5.635471343994141, 50.95634523633128],
                            [5.627918243408203, 50.963075942052164]]]
                    }
                },
                text: 'LargeDamageChange',
            }],
            text: (props: object) => {

                const matrix = zeros(6, 7);
                const fromDamageState = props['transitions']['from_damage_state'];
                const nrBuildings = props['transitions']['n_buildings'];
                const toDamageState = props['transitions']['to_damage_state'];
                for (let i = 0; i < fromDamageState.length; i++) {
                    const r = fromDamageState[i];
                    const c = toDamageState[i];
                    const nr = nrBuildings[i];
                    matrix[r][c] += nr;
                }

                const labeledMatrix = filledMatrix(matrix.length + 1, matrix[0].length + 1,  '');
                for (let r = 0; r < labeledMatrix.length; r++) {
                    for (let c = 0; c < labeledMatrix[0].length; c++) {
                        if (r === 0 && c === 0) {
                            labeledMatrix[r][c] = '<b>{{ from_to }}</b>';
                        } else if (r === 0) {
                            labeledMatrix[r][c] = `<b>${c - 1}</b>`;
                        } else if (c === 0) {
                            labeledMatrix[r][c] = `<b>${r - 1}</b>`;
                        } else if (r > 0 && c > 0) {
                            labeledMatrix[r][c] = toDecimalPlaces(matrix[r-1][c-1], 1);
                        }
                    }
                }

                return `<h4>{{ Transitions }}</h4>${createTableHtml(labeledMatrix, 'medium')}`;
            },
            summary: (value: FeatureCollection | FeatureCollection[]) => {
                let features;
                if (Array.isArray(value)) {
                    features = value[0].features;
                } else {
                    features = value.features;
                }
                const matrix = zeros(6, 7);
                for (const feature of features) {
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

                const labeledMatrix = filledMatrix(matrix.length + 1, matrix[0].length + 1,  '');
                for (let r = 0; r < labeledMatrix.length; r++) {
                    for (let c = 0; c < labeledMatrix[0].length; c++) {
                        if (r === 0 && c === 0) {
                            labeledMatrix[r][c] = { value: 'from_to', style: {'font-weight': 'bold'}};
                        } else if (r === 0) {
                            labeledMatrix[r][c] =  { value: `${c - 1}`, style: {'font-weight': 'bold'}};
                        } else if (c === 0) {
                            labeledMatrix[r][c] =  { value: `${r - 1}`, style: {'font-weight': 'bold'}};
                        } else if (r > 0 && c > 0) {
                            labeledMatrix[r][c] =  { value: toDecimalPlaces(matrix[r-1][c-1], 0) };
                        }
                    }
                }

                return {
                    component: InfoTableComponentComponent,
                    inputs: {
                        title: 'Transitions',
                        data: labeledMatrix
                    }
                };
            }
        },
        description: 'Change from previous state'
};

const tsUpdatedExposurePeruProperties: VectorLayerProperties = {
        icon: 'dot-circle',
        name: 'ts-exposure',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
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

                const dr = weightedDamage(Object.values(counts)) / 6;

                let r: number;
                let g: number;
                let b: number;
                if (total === 0) {
                    r = b = g = 160;
                } else {
                    [r, g, b] = greenRedRange(0, 0.6, dr);
                }

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.5],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    width: 2
                  })
                });
            },
            legendEntries: [{
                feature: {
                    'type': 'Feature',
                    'properties': {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3', 'D4', 'D5'], 'Buildings': [90, 10, 0, 0, 0, 0]}},
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: `
                <table class="table table-small">
                    <thead>
                    <tr>
                        <th>D0</th>
                        <th>D1</th>
                        <th>D2</th>
                        <th>D3</th>
                        <th>D4</th>
                        <th>D5</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>90</td>
                        <td>10</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                    </tbody>
                </table>
                `
            }, {
                feature: {
                    'type': 'Feature',
                    'properties': {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3', 'D4', 'D5'], 'Buildings': [0, 10, 40, 40, 10, 0]}},
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: `
                <table class="table table-small">
                    <thead>
                    <tr>
                        <th>D0</th>
                        <th>D1</th>
                        <th>D2</th>
                        <th>D3</th>
                        <th>D4</th>
                        <th>D5</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>0</td>
                        <td>10</td>
                        <td>40</td>
                        <td>40</td>
                        <td>10</td>
                        <td>0</td>
                    </tr>
                    </tbody>
                </table>
                `
            }, {
                feature: {
                    'type': 'Feature',
                    'properties': {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3', 'D4', 'D5'], 'Buildings': [0, 0, 0, 0, 20, 80]}},
                    'geometry': {
                      'type': 'Polygon',
                      'coordinates': [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: `
                <table class="table table-small">
                    <thead>
                    <tr>
                        <th>D0</th>
                        <th>D1</th>
                        <th>D2</th>
                        <th>D3</th>
                        <th>D4</th>
                        <th>D5</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>20</td>
                        <td>80</td>
                    </tr>
                    </tbody>
                </table>
                `
            }],
            text: (props: object) => {
                const anchor = document.createElement('div');
                const expo = props['expo'];

                const data: {[groupName: string]: BarData[]} = {};
                for (let i = 0; i < expo['Taxonomy'].length; i++) {
                    const dmg = expo['Damage'][i];
                    const tax = expo['Taxonomy'][i].match(/^[a-zA-Z]*/)[0];
                    const bld = expo['Buildings'][i];
                    if (!data[tax]) {
                        data[tax] = [];
                    }
                    data[tax].push({
                        label: dmg,
                        value: bld
                    });
                }

                for (const label in data) {
                    if (data[label]) {
                        data[label].sort((dp1, dp2) => dp1.label > dp2.label ? 1 : -1);
                    }
                }

                const anchorUpdated = createGroupedBarChart(anchor, data, 400, 300, '{{ taxonomy_DX }}', '{{ nr_buildings }}');

                const legend = `<ul><li><b>D0:</b> {{No_damage}}</li><li><b>D1:</b> {{Minor_damage}}</li><li><b>D2:</b> {{Moderate_damage}}</li><li><b>D3:</b> {{Major_damage}}</li><li><b>D4:</b> {{ Complete_damage }}</li><li><b>D5:</b> {{ Collapsed }}</li><li><b>D6:</b> {{ Washed_away }}</li></ul>`;

                return `<h4 style="color: var(--clr-p1-color, #666666);">Tsunami: {{ damage_classification }}</h4>${anchor.innerHTML} ${legend}{{StatesNotComparable}}`;
            },
            summary: (value: FeatureCollection | FeatureCollection[]) => {
                let features;
                if (Array.isArray(value)) {
                    features = value[0].features;
                } else {
                    features = value.features;
                }
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0,
                    'D5': 0,
                    'D6': 0
                };
                for (const feature of features) {
                    for (let i = 0; i < feature.properties.expo.Damage.length; i++) {
                        const damageClass = feature.properties.expo.Damage[i];
                        const nrBuildings = feature.properties.expo.Buildings[i];
                        counts[damageClass] += nrBuildings;
                    }
                }
                const html = createHeaderTableHtml(Object.keys(counts), [Object.values(counts).map(c => toDecimalPlaces(c, 0))]);
                const comp: IDynamicComponent = {
                    component: TranslatableStringComponent,
                    inputs: {
                      text: html
                    }
                  };
                  return comp;
            }
        },
        description: 'NumberGoodsInDamageState'
};

export const tsDamagePeruM: WpsData & MultiVectorLayerProduct = {
    uid: 'ts_deus_output_values_peru',
    description: {
        id: 'merged_output',
        title: '',
        reference: false,
        defaultValue: null,
        format: 'application/json',
        type: 'complex',
        description: '',
        vectorLayers: [tsUpdatedExposurePeruProperties, tsTransitionPeruProperties, tsDamagePeruProperties]
    },
    value: null
};

export class TsDeusPeru implements ExecutableProcess, WizardableProcess {

    readonly state: ProcessState;
    readonly uid: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly description?: string;
    readonly wizardProperties: WizardProperties;

    private vulnerabilityProcess: VulnerabilityModelPeru;
    private deusProcess: Deus;

    constructor(http: HttpClient, cache: Cache) {
        this.state = new ProcessStateUnavailable();
        this.uid = 'TS-Deus';
        this.name = 'Multihazard_damage_estimation/Tsunami';
        this.requiredProducts = [schemaPeru, eqDamagePeruM, tsShakemapPeru, eqUpdatedExposureRefPeru].map(p => p.uid);
        this.providedProducts = [tsDamagePeruM].map(p => p.uid);
        this.description = 'This service returns damage caused by the selected tsunami.';
        this.wizardProperties = {
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle',
            wikiLink: 'ExposureAndVulnerability'
        };

        this.vulnerabilityProcess = new VulnerabilityModelPeru(http, cache);
        this.deusProcess = new Deus(http, cache);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        // Step 1.1: preparing vulnerability-service inputs
        const vulnerabilityInputs = [ schemaPeru ];
        const vulnerabilityOutputs = [fragilityRefPeru];

        // Step 1.2: executing vulnerability-service
        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {

                    // Step 2.1: preparing deus inputs
                    const fragility = resultProducts.find(prd => prd.uid === fragilityRefPeru.uid);
                    const shakemap = inputProducts.find(prd => prd.uid === tsShakemapPeru.uid);
                    const exposure = inputProducts.find(prd => prd.uid === eqUpdatedExposureRefPeru.uid);

                    const deusInputs = [{
                            ... schemaPeru,
                            value:  'SARA_v1.0' // <-- because last exposure still used SARA!
                        }, {
                            ... fragility,
                            description: {
                                ... fragilityRefPeru.description,
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

                    // Step 2.2: executing deus
                    return this.deusProcess.execute(deusInputs, deusOutputs, doWhileExecuting);
                }),
                map((results: Product[]) => {
                    // Step 3: adding losses-by-eq to losses-from-eq-to-tsunami
                    const lossesByEq = inputProducts.find(ip => ip.uid === eqDamagePeruM.uid).value[0];
                    const lossesFromEqToTsunami = results[0].value[0];
                    for (let i = 0; i < lossesFromEqToTsunami.features.length; i++) {
                        lossesFromEqToTsunami.features[i].properties['loss_value'] += lossesByEq.features[i].properties['loss_value'];
                    }
                    return results;
                })
            );
    }
}
