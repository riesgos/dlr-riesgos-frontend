import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { schemaPeru } from './exposure';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { fragilityRefDeusInputPeru, shakemapRefDeusInputPeru, exposureRefDeusInputPeru } from './deusTranslator';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { createBarchart, Bardata } from 'src/app/helpers/d3charts';
import { redGreenRange, ninetyPercentLowerThan } from 'src/app/helpers/colorhelpers';
import { HttpClient } from '@angular/common/http';




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
                return `<h4>Loss ${props['name']}</h4><p>${props['loss_value']} ${props['loss_unit']}</p>`;
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
                const anchorUpdated = createBarchart(anchor, data, 300, 200, 'damage-state', 'n. buildings');
                return `<h4>Transitions ${props['name']}</h4>${anchor.innerHTML}`;
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
                const anchorUpdated = createBarchart(anchor, data, 300, 200, 'damage-state', '# buildings');
                return `<h4>Updated exposure ${props['name']}</h4>${anchor.innerHTML}`;
            }
        },
        description: 'Amount of goods that are exposed to a hazard.'
    },
    value: null
};


export class EqDeusPeru extends WpsProcess implements WizardableProcess {

    readonly wizardProperties = {
        providerName: 'Helmholtz Centre Potsdam',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        shape: 'dot-circle' as 'dot-circle'
    };

    constructor(http: HttpClient) {
        super(
            'EQ-DEUS Peru',
            'Multihazard damage estimation / EQ',
            [lossPeru, schemaPeru, fragilityRefDeusInputPeru, shakemapRefDeusInputPeru, exposureRefDeusInputPeru].map(p => p.uid),
            [eqDamagePeru, eqTransitionPeru, eqUpdatedExposurePeru].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.DeusProcess',
            'This service outputs damage caused by a given earthquake.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
    }
}
