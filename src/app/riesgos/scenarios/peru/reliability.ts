import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, Cache } from 'src/app/services/wps';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import olFeature from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { eqShakemapRefPeru } from './shakyground';
import { Observable } from 'rxjs';
import { greenYellowRedRange } from 'src/app/helpers/colorhelpers';
import Geometry from 'ol/geom/Geometry';



export const countryPeru: WpsData & Product = {
    uid: 'systemreliability_country_peru',
    description: {
        id: 'country',
        title: '',
        defaultValue: 'chile',
        description: 'What country are we working in?',
        reference: false,
        type: 'literal',
        format: 'text/plain'
    },
    value: 'peru'
};


export const hazardEqPeru: WpsData & Product = {
    uid: 'systemreliability_hazard_eq_peru',
    description: {
        id: 'hazard',
        title: '',
        defaultValue: 'earthquake',
        description: 'What hazard are we dealing with?',
        reference: false,
        type: 'literal',
        format: 'text/plain'
    },
    value: 'earthquake'
};

export const damageConsumerAreasPeru: WpsData & Product & VectorLayerProduct = {
    uid: 'systemreliability_damage_consumerareas_peru',
    description: {
        id: 'damage_consumer_areas',
        title: '',
        format: 'application/vnd.geo+json',
        name: 'Damage to consumer areas',
        icon: 'router',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
                const props = feature.getProperties();
                let probDisr = 0;
                if (props['Prob_Disruption']) {
                    probDisr = props['Prob_Disruption'];
                }

                const [r, g, b] = greenYellowRedRange(0, 1, probDisr);

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
            text: (props: object) => {
                const selectedProps = {
                    'Area': props['Area'],
                    '{{ Prob_Interuption }}': props['Prob_Disruption'],
                };
                return createKeyValueTableHtml('{{ PowerGrid }}', selectedProps, 'medium');
            },
            legendEntries: [{
                feature: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ [ [ 5.627918243408203, 50.963075942052164 ], [ 5.627875328063965, 50.958886259879264 ], [ 5.635471343994141, 50.95634523633128 ], [ 5.627918243408203, 50.963075942052164 ] ] ]
                    },
                    properties: {Prob_Disruption: 0.1}
                },
                text: 'Prob. 0.1',
            }, {
                feature: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ [ [ 5.627918243408203, 50.963075942052164 ], [ 5.627875328063965, 50.958886259879264 ], [ 5.635471343994141, 50.95634523633128 ], [ 5.627918243408203, 50.963075942052164 ] ] ]
                    },
                    properties: {Prob_Disruption: 0.5}
                },
                text: 'Prob. 0.5',
            }, {
                feature: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ [ [ 5.627918243408203, 50.963075942052164 ], [ 5.627875328063965, 50.958886259879264 ], [ 5.635471343994141, 50.95634523633128 ], [ 5.627918243408203, 50.963075942052164 ] ] ]
                    },
                    properties: {Prob_Disruption: 0.9}
                },
                text: 'Prob. 0.9',
            }]
        }
    },
    value: null
};


export class EqReliabilityPeru extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'Reliability',
            'System reliability after EQ',
            [eqShakemapRefPeru, countryPeru, hazardEqPeru].map(p => p.uid),
            [damageConsumerAreasPeru].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilitySingleProcess',
            'Process for evaluating the reliability of infrastructure networks',
            'https://riesgos.52north.org/javaps/service',
            '2.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
        this.wizardProperties = {
            providerName: 'TUM',
            providerUrl: 'https://www.tum.de/nc/en/',
            shape: 'router',
            wikiLink: 'CriticalInfrastructure'
        };
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const newInputs = inputProducts.map(p => {
            if (p.uid === eqShakemapRefPeru.uid) {
                return {
                    ... p,
                    description: {
                        ... p.description,
                        id: 'intensity'
                    }
                };
            } else {
                return p;
            }
        });

        return super.execute(newInputs, outputProducts, doWhileExecuting);
    }
}
