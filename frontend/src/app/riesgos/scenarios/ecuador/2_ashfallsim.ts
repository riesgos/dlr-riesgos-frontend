import { createKeyValueTableHtml } from 'src/app/helpers/others';
import { toDecimalPlaces, linInterpolateXY } from 'src/app/helpers/colorhelpers';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { MappableProductAugmenter, WizardableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { VectorLayerProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/wizardable_products';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { LegendComponent } from 'src/app/components/dynamic/legend/legend.component';



export class Ashfall implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'ashfallVectors';
    }

    makeProductMappable(product: RiesgosProductResolved): VectorLayerProduct[] {
        const allDepths = [];

        return [{
            ...product,
            description: {
                id: 'ashfall',
                icon: 'volcanoe',
                type: 'complex',
                format: 'application/vnd.geo+json',
                name: 'ashfall-depth',
                vectorLayerAttributes: {
                    featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
                        const props = feature.getProperties();
                        const thickness = props.thickness;
                        allDepths.push(thickness);
        
                        const hue = linInterpolateXY(0, 170, 100, 280, thickness);
                        const colorString = `hsl(${hue}, 50%, 50%)`;
        
                        // we can also repeat labels along each polygon-segment, roughly like this:
                        // https://stackoverflow.com/questions/38391780/multiple-text-labels-along-a-linestring-feature
        
                        return new olStyle({
                            fill: new olFill({
                                color: colorString,
                            }),
                            stroke: new olStroke({
                                color: [0, 0, 0, 1],
                                width: 2
                            }),
                            text: new olText({
                                font: 'bold 14px Calibri,sans-serif',
                                text: toDecimalPlaces(thickness as number, 1) + ' mm',
                                fill: new olFill({ color: [0, 0, 0, 1] }),
                                stroke: new olStroke({ color: colorString, width: 1 }),
                                placement: 'line',
                                textAlign: 'left'
                                // maxAngle: maxAngle,
                                // overflow: true,
                            }),
                            zIndex: thickness * 100
                        });
                    },
                    dynamicLegend: value => {

                        const hue10  = linInterpolateXY(0, 170, 100, 280, 10);
                        const hue25  = linInterpolateXY(0, 170, 100, 280, 25);
                        const hue50  = linInterpolateXY(0, 170, 100, 280, 50);
                        const hue75  = linInterpolateXY(0, 170, 100, 280, 75);
                        const hue100 = linInterpolateXY(0, 170, 100, 280, 100);
                        const color10   = `hsl(${hue10}, 50%, 50%)`;
                        const color25   = `hsl(${hue25}, 50%, 50%)`;
                        const color50   = `hsl(${hue50}, 50%, 50%)`;
                        const color75   = `hsl(${hue75}, 50%, 50%)`;
                        const color100  = `hsl(${hue100}, 50%, 50%)`;

                        return {
                            component: LegendComponent,
                            inputs: {
                                entries: [{
                                    color: color10,
                                    text: 'Thickness10'
                                }, {
                                    color: color25,
                                    text: 'Thickness25'
                                }, {
                                    color: color50,
                                    text: 'Thickness50'
                                }, {
                                    color: color75,
                                    text: 'Thickness75'
                                }, {
                                    color: color100,
                                    text: 'Thickness100'
                                }],
                                height: 100
                            }
                        };
                    },
                    detailPopupHtml: (properties) => {
                        const thickness = properties['thickness'];
                        if (thickness) {
                            allDepths.sort();
                            const nextBiggerThickness = allDepths.find(d => +d > +thickness);
                            let thicknessText: string;
                            if (nextBiggerThickness) {
                                thicknessText = `${toDecimalPlaces(thickness as number, 1)} - ${toDecimalPlaces(nextBiggerThickness as number, 1)} mm`;
                            } else {
                                thicknessText = `> ${toDecimalPlaces(thickness as number, 1)} mm`;
                            }
        
                            const vol = 1 * 1 * thickness / 1000;   // [m] * [m] * [mm] * [m/mm] = [m^3]
                            const mass = vol * 1000;                // [m^3] * [kg/m^3] = [kg]
                            const weightForce = mass * 9.81;        // [kg] * [m/s^2] = [N]
                            const pressure = weightForce / (1 * 1); // [N] / [m^2] = [Pa]
        
                            const selectedProperties = {
                                '{{ Thickness }}': thicknessText,
                                '{{ VEI }}': toDecimalPlaces(properties['vei'] as number, 1),
                                '{{ Expected_load }}': `${pressure.toFixed(0)} Pa`,
                                '{{ Probability_of_exceedence }}': properties['prob'] + ' %'
                            };
                            return createKeyValueTableHtml('{{ Ashfall }}', selectedProperties, 'medium');
                        }
                    }
                }
            },
        }]
    }

}

export class Probability implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'ashfallProb';
    }

    makeProductWizardable(product: RiesgosProduct): StringSelectUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                options: ['1', '50', '99'],
                defaultValue: '50',
                wizardProperties: {
                    fieldtype: 'stringselect',
                    name: 'Probability_of_exceedence',
                    description: 'probability of range',
                }
            },
        }]
    }

}


export class AshfallService implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'Ashfall';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Ecuador',
            wizardProperties: {
                providerName: 'IGN',
                providerUrl: 'https://www.igepn.edu.ec',
                shape: 'volcanoe',
                wikiLink: 'AshfallSimulation'
            }
        }
    }

}
