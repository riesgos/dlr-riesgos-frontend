import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { MappableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { VectorLayerProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { LegendComponent } from 'src/app/components/dynamic/legend/legend.component';



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
                    dynamicLegend: value => ({
                        component: LegendComponent,
                        inputs: {
                            entries: [{
                                text: 'Prob. 0.1',
                                color: '#96fd7d'
                            }, {
                                text: 'Prob. 0.5',
                                color: '#fdfd7d'
                            }, {
                                text: 'Prob. 0.9',
                                color: '#fd967d'
                            }],
                            continuous: true,
                            fractionGraphic: 0.1,
                            height: 90
                        }
                    }),
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
