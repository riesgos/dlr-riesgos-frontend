import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { WpsData } from '@ukis/services-wps/src/public-api';
import { Product, WpsProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { redGreenRange, ninetyPercentLowerThan } from 'src/app/helpers/colorhelpers';
import { Bardata, createBarchart } from 'src/app/helpers/d3charts';
import { WizardableProcess, WizzardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { loss, eqUpdatedExposure, eqDamage } from './eqDeus';
import { schema } from './exposure';
import { fragilityRefDeusInput } from './deusTranslator';
import { tsShakemap } from './tsService';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { HttpClient } from '@angular/common/http';



export const tsDamage: VectorLayerData & WpsData & Product = {
    uid: 'tsDamage',
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

export const tsTransition: VectorLayerData & WpsData & Product = {
    uid: 'tsTransition',
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
                const anchorUpdated = createBarchart(anchor, data, 300, 200, 'damage-state', '% buildings');
                return `<h4>Transitions ${props['name']}</h4>${anchor.innerHTML}`;
            }
        },
        description: 'Change from previous state to current one'
    },
    value: null
};

export const tsUpdatedExposure: VectorLayerData & WpsData & Product = {
    uid: 'tsUpdatedExposure',
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



export class TsDeus extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizzardProperties;

    constructor(http: HttpClient) {
        super(
            'TS-DEUS',
            'Multihazard damage estimation / TS',
            [eqDamage, schema, fragilityRefDeusInput, tsShakemap, eqUpdatedExposure].map(p => p.uid),
            [tsDamage, tsTransition, tsUpdatedExposure].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.DeusProcess',
            'This service outputs damage caused by a given earthquake.',
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

}
