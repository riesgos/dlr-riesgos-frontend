import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { MappableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { MappableProduct, VectorLayerProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { createKeyValueTableHtml } from 'src/app/helpers/others';



export class DamageConsumerAreasEcuador implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'sysrelEcuador';
    }

    makeProductMappable(product: RiesgosProductResolved): VectorLayerProduct[] {
        return [{
            ...product,
            description: {
                id: 'damage_consumer_areas',
                icon: 'router',
                format: 'application/vnd.geo+json',
                name: 'Productname_system_reliability_vector',
                type: 'complex',
                vectorLayerAttributes: {
                    featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
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
                            width: 2
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
                    detailPopupHtml: (props: object) => {
                        const selectedProps = {
                            '{{ Name }}': props['Name'],
                            '{{ Population }}': props['population'],
                            '{{ Prob_Interuption }}': props['Prob_Disruption'],
                        };
                        return createKeyValueTableHtml('{{ PowerGrid }}', selectedProps, 'medium');
                    }
                }
            },
        }];
    }

}


export class LaharReliability implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'SystemReliabilityEcuador';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Ecuador',
            wizardProperties: {
                providerName: 'TUM',
                providerUrl: 'https://www.tum.de/nc/en/',
                shape: 'router',
                wikiLink: 'CriticalInfrastructureEcuador'
            }
        }
    }

}
