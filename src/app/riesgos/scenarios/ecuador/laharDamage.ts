import { ExecutableProcess, ProcessState, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { ashfallUpdatedExposureRef } from './ashfallDamage';
import { laharVelocityShakemapRef } from './laharWrapper';
import { Deus } from '../chile/deus';
import { VulnerabilityModelEcuador, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './vulnerability';
import { Observable } from 'rxjs';
import { schemaEcuador, initialExposureLaharRef } from './exposure';
import { fragilityRef } from '../chile/modelProp';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import { WpsData, Cache } from 'src/app/services/wps';
import { MultiVectorLayerProduct, VectorLayerProperties } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { greenRedRange, toDecimalPlaces, weightedDamage, yellowBlueRange } from 'src/app/helpers/colorhelpers';
import { FeatureCollection } from '@turf/helpers';
import { createTableHtml, zeros, filledMatrix } from 'src/app/helpers/others';
import { BarData, createGroupedBarChart } from 'src/app/helpers/d3charts';
import { InfoTableComponentComponent, TableEntry } from 'src/app/components/dynamic/info-table-component/info-table-component.component';
import { maxDamage$ } from '../chile/constants';
import Geometry from 'ol/geom/Geometry';



export const laharLossProps: VectorLayerProperties = {
        name: 'laharLoss',
        icon: 'avalance',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
                const props = feature.getProperties();
                const [r, g, b] = greenRedRange(0, 1, props.loss_value / maxDamage$);
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
                text: 'Loss 100000 USD'
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
                text: 'Loss 500000 USD'
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
                text: 'Loss 1000000 USD'
            }],
            text: (props: object) => {
                return `<h4>{{ Loss }}</h4><p>${toDecimalPlaces(props['loss_value'] / 1000000, 2)} M${props['loss_unit']}</p>`;
            },
            summary: (value: [FeatureCollection]) => {
                const features = value[0].features;
                const damages = features.map(f => f.properties['loss_value']);
                const totalDamage = damages.reduce((carry, current) => carry + current, 0);
                const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 0) + ' MUSD';

                return {
                    component: InfoTableComponentComponent,
                    inputs: {
                        title: 'Total_loss',
                        data: [[{value: 'Total_loss'}, {value: totalDamageFormatted}]],
                    }
                };
            }
        }

};

export const laharTransitionProps: VectorLayerProperties = {
        name: 'laharTransition',
        icon: 'avalance',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
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

                const weightedChange = (meanStateTo - meanStateFrom) / (5 - meanStateFrom);

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
                    "properties": {'transitions': {'n_buildings': [100], 'from_damage_state': [0, 0, 0, 0], 'to_damage_state': [90, 10, 0, 0]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'SmallDamageChange'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'transitions': {'n_buildings': [100], 'from_damage_state': [0, 0, 0, 0], 'to_damage_state': [0, 0, 10, 90]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'LargeDamageChange'
            }],
            text: (props: object) => {

                const matrix = zeros(5, 5);
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

                return `<h4>{{ Transitions }}</h4>${createTableHtml(labeledMatrix)}`;
            },
            summary: (value: [FeatureCollection]) => {
                const matrix = zeros(5, 5);
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

                const labeledMatrix = filledMatrix(matrix.length + 1, matrix[0].length + 1,  '');
                for (let r = 0; r < labeledMatrix.length; r++) {
                    for (let c = 0; c < labeledMatrix[0].length; c++) {
                        if (r === 0 && c === 0) {
                            labeledMatrix[r][c] = { value: 'from_to', style: {'font-weight': 'bold'}};
                        } else if (r === 0) {
                            labeledMatrix[r][c] = {value: `${c - 1}`, style: {'font-weight': 'bold'}};
                        } else if (c === 0) {
                            labeledMatrix[r][c] = {value: `${r - 1}`, style: {'font-weight': 'bold'}};
                        } else if (r > 0 && c > 0) {
                            labeledMatrix[r][c] = {value: toDecimalPlaces(matrix[r-1][c-1], 0) };
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
        }
};

export const laharUpdatedExposureProps: VectorLayerProperties = {
        name: 'laharExposure',
        icon: 'avalance',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
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

                const dr = weightedDamage(Object.values(counts)) / 4;

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
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3'], 'Buildings': [90, 10, 0, 0]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
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
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>90</td>
                        <td>10</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                    </tbody>
                </table>
                `
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3'], 'Buildings': [10, 40, 40, 10]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
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
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>10</td>
                        <td>40</td>
                        <td>40</td>
                        <td>10</td>
                    </tr>
                    </tbody>
                </table>
                `
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'expo': {'Damage': ['D0', 'D1', 'D2', 'D3'], 'Buildings': [0, 0, 10, 90]}},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
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
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>0</td>
                        <td>0</td>
                        <td>10</td>
                        <td>90</td>
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
                    const tax = expo['Taxonomy'][i];
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
                return `<h4 style="color: var(--clr-p1-color, #666666);">Lahar: {{ damage_classification }}</h4>${anchor.innerHTML} {{ DamageStatesMavrouli }}{{StatesNotComparable}}`;
            },
            summary: (value: [FeatureCollection]) => {
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0
                };
                for (const feature of value[0].features) {
                    for (let i = 0; i < feature.properties.expo.Damage.length; i++) {
                        const damageClass = feature.properties.expo.Damage[i];
                        const nrBuildings = feature.properties.expo.Buildings[i];
                        counts[damageClass] += nrBuildings;
                    }
                }

                const data: TableEntry[][] = [[], []];
                for (const dc in counts) {
                    data[0].push({
                        value: dc
                    });
                    data[1].push({
                        value: toDecimalPlaces(counts[dc], 0)
                    });
                }

                return {
                    component: InfoTableComponentComponent,
                    inputs: {
                        data: data,
                        bottomText: 'DamageStatesMavrouli'
                    }
                };
            }
        }

};

export const laharDamageM: WpsData & MultiVectorLayerProduct = {
    uid: 'lahar_damage_output_values',
    description: {
        id: 'merged_output',
        title: '',
        reference: false,
        defaultValue: null,
        format: 'application/json',
        type: 'complex',
        description: '',
        vectorLayers: [laharLossProps, laharUpdatedExposureProps]
    },
    value: null
};


export const laharUpdatedExposureRef: WpsData & Product = {
    uid: 'laharUpdatedExposureRef',
    description: {
        id: 'updated_exposure',
        title: '',
        format: 'application/json',
        reference: true,
        type: 'complex'
    },
    value: null
};



export class DeusLahar implements ExecutableProcess, WizardableProcess {

    readonly uid: string = 'DeusLahar';
    readonly name: string = 'Lahar Damage';
    readonly state: ProcessState = new ProcessStateUnavailable();
    readonly requiredProducts: string[] = [initialExposureLaharRef, laharVelocityShakemapRef].map(p => p.uid);
    readonly providedProducts: string[] = [laharDamageM, laharUpdatedExposureRef].map(p => p.uid);
    readonly description?: string = 'Deus Lahar description';
    readonly wizardProperties: WizardProperties = {
        shape: 'dot-circle',
        providerName: 'GFZ',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        wikiLink: 'ExposureAndVulnerabilityEcuador'
    };

    private deus: Deus;
    private vulnerability: VulnerabilityModelEcuador;

    constructor(http: HttpClient, cache: Cache) {
        this.deus = new Deus(http, cache);
        this.vulnerability = new VulnerabilityModelEcuador(http, cache);
    }

    execute(
        inputs: Product[], outputs?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void
    ): Observable<Product[]> {

        const vulnInputs = [{
            ... schemaEcuador,
            value: 'Mavrouli_et_al_2014',
        }, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador];
        const vulnOutputs = [fragilityRef];

        return this.vulnerability.execute(vulnInputs, vulnOutputs, doWhileExecuting).pipe(
            switchMap((results: Product[]) => {
                const fragility = results.find(prd => prd.uid === fragilityRef.uid);
                const shakemap = inputs.find(prd => prd.uid === laharVelocityShakemapRef.uid);
                const exposure = inputs.find(prd => prd.uid === initialExposureLaharRef.uid);

                const deusInputs: Product[] = [{
                    ... shakemap,
                    description: {
                        ... shakemap.description,
                        format: 'text/xml',
                        id: 'intensity'
                    }
                },
                {
                    ... exposure,
                    description: {
                        ... exposure.description,
                        id: 'exposure'
                    },
                    value: exposure.value
                }, {
                    ... schemaEcuador,
                    value: 'Mavrouli_et_al_2014',
                }, {
                    ... fragility,
                    description: {
                        ... fragilityRef.description,
                        id: 'fragility'
                    }
                }
                ];

                const deusOutputs: Product[] = [laharDamageM, laharUpdatedExposureRef];

                return this.deus.execute(deusInputs, deusOutputs, doWhileExecuting);
            })
        );
    }
}
