import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { MappableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { MultiVectorLayerProduct, VectorLayerProperties } from 'src/app/components/map/mappable/mappable_products';
import { getMaxFromDict } from 'src/app/helpers/others';
import { FeatureCollection } from '@turf/helpers';
import { InfoTableComponentComponent, TableEntry } from 'src/app/components/dynamic/info-table-component/info-table-component.component';
import { greenVioletRangeStepwise, toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { BarData, createGroupedBarChart } from 'src/app/helpers/d3charts';
import { maxDamage$ } from './constants';
import { LegendComponent } from 'src/app/components/dynamic/legend/legend.component';



export const laharLossProps: VectorLayerProperties = {
        name: 'laharLoss',
        icon: 'avalanche',
        vectorLayerAttributes: {
            featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
                const props = feature.getProperties();
                const [r, g, b] = greenVioletRangeStepwise(0, maxDamage$, props.loss_value);
                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 1],
                  }),
                  stroke: new olStroke({
                    color: [0.8 * r, 0.8 * g, 0.8 * b, 1],
                    width: 2
                  })
                });
            },
            dynamicLegend: data => {
                const color1 = greenVioletRangeStepwise(0, maxDamage$,   100_000);
                const color2 = greenVioletRangeStepwise(0, maxDamage$,   500_000);
                const color3 = greenVioletRangeStepwise(0, maxDamage$, 1_000_000);

                return {
                    component: LegendComponent,
                    inputs: {
                      entries: [{
                        text: '  100.000 USD',
                        color: `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`
                      }, {
                        text: '  500.000 USD',
                        color: `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`
                      }, {
                        text: '1.000.000 USD',
                        color: `rgb(${color3[0]}, ${color3[1]}, ${color3[2]})`
                      }],
                      height: 70,
                      width: 350,
                      continuous: true,
                      fractionGraphic: 0.1,
                    }
                  }
            },
            detailPopupHtml: (props: object) => {
                return `<h4>{{ economic_loss }}</h4><p>${toDecimalPlaces(props['loss_value'] / 1000000, 2)} M${props['loss_unit']}</p>`;
            },
            globalSummary: (value: FeatureCollection) => {
                const features = value.features;
                const damages = features.map(f => f.properties['loss_value']);
                const totalDamage = damages.reduce((carry, current) => carry + current, 0);
                const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 2) + ' MUSD';

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

export const laharUpdatedExposureProps: VectorLayerProperties = {
        name: 'laharExposure',
        icon: 'avalanche',
        vectorLayerAttributes: {
            featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
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

                // const dr = weightedDamage(Object.values(counts)) / 4;
                const {maxKey, maxVal} = getMaxFromDict(counts);
                const dr = +(maxKey[1]);

                let r: number;
                let g: number;
                let b: number;
                if (total === 0) {
                    r = b = g = 160;
                } else {
                    [r, g, b] = greenVioletRangeStepwise(0, 4, dr);
                }

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 1],
                  }),
                  stroke: new olStroke({
                    color: [0.8 * r, 0.8 * g, 0.8 * b, 1],
                    width: 2
                  })
                });
            },

            dynamicLegend: data => {

                function getColor(dr: number) {
                    const [r, g, b] = greenVioletRangeStepwise(0, 4, dr);
                    return `rgb(${r}, ${g}, ${b})`;
                }

                return {
                    component: LegendComponent,
                    inputs: {
                        entries: [{
                            color: getColor(0),
                            text: `mostly_no_damage`
                        }, {
                            color: getColor(1),
                            text: `mostly_light_damage_nonexistent`
                        }, {
                            color: getColor(2),
                            text: `mostly_moderate_damage_structural`
                        }, {
                            color: getColor(3),
                            text: `mostly_extensive_damage_structural`
                        }, {
                            color: getColor(4),
                            text: `mostly_collapsed_damage_lahar`
                        }],
                        height: 90,
                        width: 330,
                        fractionGraphic: 0.05
                    }
                };
            },
            detailPopupHtml: (props: object) => {
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
                        // There seems to be never an entry with 'D1'
                        if (!data[label].find(e => e.label === 'D1')) {
                            data[label].push({label: "D1", value: 0});
                        }
                        data[label].sort((dp1, dp2) => dp1.label > dp2.label ? 1 : -1);
                    }
                }

                const anchorUpdated = createGroupedBarChart(anchor, data, 400, 400, '{{ taxonomy_DX }}', '{{ nr_buildings }}');
                return `<h4 style="color: var(--clr-p1-color, #666666);">{{ Lahar_damage_classification }}</h4>${anchor.innerHTML} {{ DamageStatesMavrouli }}{{StatesNotComparable}}`;
            },
            globalSummary: (value: FeatureCollection) => {
                const counts = {
                    'D0': 0,
                    'D1': 0,
                    'D2': 0,
                    'D3': 0,
                    'D4': 0
                };
                for (const feature of value.features) {
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
                        bottomText: 'BuildingTypesMavrouli'
                    }
                };
            }
        }

};



export class LaharDamageMultiLayer implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'laharDamage';
    }

    makeProductMappable(product: RiesgosProductResolved): MultiVectorLayerProduct[] {
        return [{
            ...product,
            description: {
                format: 'application/json',
                type: 'complex',
                vectorLayers: [laharUpdatedExposureProps, laharLossProps]
            },
        }];
    }

}


export class LaharDamage implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'LaharDamage';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ... step,
            scenario: 'Ecuador',
            wizardProperties: {
                shape: 'dot-circle',
                providerName: 'GFZ',
                providerUrl: 'https://www.gfz-potsdam.de/en/',
                wikiLink: 'ExposureAndVulnerabilityEcuador'
            }
        }
    }

}
