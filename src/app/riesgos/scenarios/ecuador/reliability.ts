import { HttpClient } from '@angular/common/http';
import { WpsData } from '@dlr-eoc/services-ogc';
import { Product, WpsProcess, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { laharShakemap } from './lahar';
import { Observable } from 'rxjs';
import { laharVelocityShakemapRef, laharHeightShakemapRef } from './laharWrapper';
import { createKeyValueTableHtml } from 'src/app/helpers/others';



export const countryEcuador: WpsData & Product = {
    uid: 'systemreliability_country_ecuador',
    description: {
        id: 'country',
        defaultValue: 'ecuador',
        description: 'What country are we working in?',
        reference: false,
        type: 'literal',
        format: 'application/text',
    },
    value: 'ecuador'
};


export const hazardLahar: WpsData & Product = {
    uid: 'systemreliability_hazard_lahar',
    description: {
        id: 'hazard',
        defaultValue: 'lahar',
        description: 'What hazard are we dealing with?',
        reference: false,
        type: 'literal',
        format: 'application/text',
    },
    value: 'lahar'
};

export const damageConsumerAreasEcuador: WpsData & Product & VectorLayerProduct = {
    uid: 'systemreliability_damage_consumerareas',
    description: {
        id: 'damage_consumer_areas',
        icon: 'router',
        format: 'application/vnd.geo+json',
        name: 'Damage to consumer areas',
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
            legendEntries: [{
                feature: {
                    "type": "Feature",
                    "properties": {'Prob_Disruption': 0.05},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Probability of disruption: 0.05'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'Prob_Disruption': 0.4},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Probability of disruption: 0.4'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'Prob_Disruption': 0.7},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Probability of disruption: 0.7'
            }],
            text: (props: object) => {
                const selectedProps = {
                    'Name': props['Name'],
                    'Area': props['Area'],
                    'Population': props['population'],
                    'Prob. of interuption': props['Prob_Disruption'],
                };
                return createKeyValueTableHtml('Power supply', selectedProps);
            }
        }
    },
    value: null
};


export class LaharReliability extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'Reliability',
            'System reliability after Lahar',
            [laharHeightShakemapRef, laharVelocityShakemapRef, countryEcuador, hazardLahar].map(p => p.uid),
            [damageConsumerAreasEcuador].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilityMultiProcess',
            'Process for evaluating the reliability of infrastructure networks',
            'http://91.250.85.221/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
        );
        this.wizardProperties = {
            providerName: 'TUM',
            providerUrl: 'https://www.tum.de/nc/en/',
            shape: 'router',
            wikiLink: 'Reliability'
        };
    }

    execute(inputProducts: Product[], outputProducts: Product[], doWhileExecuting): Observable<Product[]> {

        const newInputProducts = inputProducts.map(prod => {
            switch (prod.uid) {
                case laharHeightShakemapRef.uid:
                    return {
                        ... prod,
                        description: {
                            ... prod.description,
                            format: 'text/xml',
                            id: 'height'
                        }
                    };
                case laharVelocityShakemapRef.uid:
                    return {
                        ... prod,
                        description: {
                            ... prod.description,
                            format: 'text/xml',
                            id: 'velocity'
                        }
                    };
                case countryEcuador.uid:
                case hazardLahar.uid:
                    return prod;
            }
        });

        return super.execute(newInputProducts, outputProducts, doWhileExecuting);
    }

}
