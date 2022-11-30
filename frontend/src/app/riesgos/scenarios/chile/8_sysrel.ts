import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { VectorLayerProduct } from "src/app/components/map/mappable/mappable_products";
import { greenYellowRedRange } from "src/app/helpers/colorhelpers";
import { createKeyValueTableHtml } from "src/app/helpers/others";
import { MappableProductAugmenter, WizardableStepAugmenter } from "src/app/services/augmenter/augmenter.service";
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from "../../riesgos.state";
import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { LegendComponent } from "src/app/components/dynamic/legend/legend.component";


export class DamageConsumerAreasChile implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'damageConsumerAreasChile';
    }

    makeProductMappable(product: RiesgosProductResolved): VectorLayerProduct[] {
        return [{
            ...product,
            description: {
                id: 'damage_consumer_areas',
                format: 'application/vnd.geo+json',
                name: 'Productname_system_reliability_vector',
                icon: 'router',
                type: 'complex',
                vectorLayerAttributes: {
                    featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
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
                    detailPopupHtml: (props: object) => {
                        const selectedProps = {
                            'Area': props['Area'],
                            '{{ Prob_Interuption }}': props['Prob_Disruption'],
                        };
                        return createKeyValueTableHtml('{{ PowerGrid }}', selectedProps, 'medium');
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
                            height: 90,
                            fractionGraphic: 0.1,
                        }
                    }),
                }
            },
        }];
    }

}

export class EqReliabilityChile implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'damageConsumerAreasChile'
    }
    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Chile',
            wizardProperties: {
                providerName: 'TUM',
                providerUrl: 'https://www.tum.de/nc/en/',
                shape: 'router',
                wikiLink: 'CriticalInfrastructure'
            }
        }
    }

}
