import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData, Cache } from '@dlr-eoc/services-ogc';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { eqShakemapRef } from './shakyground';
import { Observable } from 'rxjs';



export const countryChile: WpsData & Product = {
    uid: 'systemreliability_country_chile',
    description: {
        id: 'country',
        defaultValue: 'chile',
        description: 'What country are we working in?',
        reference: false,
        type: 'literal',
        format: 'application/text'
    },
    value: 'chile'
};


export const hazardEq: WpsData & Product = {
    uid: 'systemreliability_hazard_eq',
    description: {
        id: 'hazard',
        defaultValue: 'earthquake',
        description: 'What hazard are we dealing with?',
        reference: false,
        type: 'literal',
        format: 'application/text'
    },
    value: 'earthquake'
};

export const damageConsumerAreas: WpsData & Product & VectorLayerProduct = {
    uid: 'systemreliability_damage_consumerareas',
    description: {
        id: 'damage_consumer_areas',
        format: 'application/vnd.geo+json',
        name: 'Damage to consumer areas',
        icon: 'router',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                let probDisr = 0;
                if (props['Prob_Disruption']) {
                    probDisr = props['Prob_Disruption'];
                }

                let r, g, b;
                if (probDisr <= 0.1) {
                    r = 0;
                    g = 255;
                    b = 0;
                } else if (probDisr <= 0.5) {
                    const perc = ((probDisr - 0.5) / (0.1 - 0.5));
                    r = 255 * perc;
                    g = 255 * (1 - perc);
                    b = 0;
                } else {
                    r = 255;
                    g = 0;
                    b = 0;
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
                const selectedProps = {
                    'Nombre': props['Name'],
                    'Población': props['population'],
                    'Prob. de interrupción': props['Prob_Disruption'],
                };
                return createKeyValueTableHtml('Red eléctrica', selectedProps, 'medium');
            }
        }
    },
    value: null
};


export class EqReliability extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'Reliability',
            'System reliability after EQ',
            [eqShakemapRef, countryChile, hazardEq].map(p => p.uid),
            [damageConsumerAreas].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilitySingleProcess',
            'Process for evaluating the reliability of infrastructure networks',
            'http://91.250.85.221/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
        this.wizardProperties = {
            providerName: 'TUM',
            providerUrl: 'https://www.tum.de/nc/en/',
            shape: 'router',
            wikiLink: 'Reliability'
        };
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const newInputs = inputProducts.map(p => {
            if (p.uid === eqShakemapRef.uid) {
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
