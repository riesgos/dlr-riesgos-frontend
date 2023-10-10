import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import Geometry from 'ol/geom/Geometry';
import olFeature from 'ol/Feature';
import { IDynamicComponent } from '@dlr-eoc/core-ui';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';
import { VectorLayerProduct } from 'src/app/components/map/mappable/mappable_products';
import { weightedDamage } from 'src/app/helpers/colorhelpers';
import { BarData, createBarChart } from 'src/app/helpers/d3charts';
import { MappableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { LegendComponent } from 'src/app/components/dynamic/legend/legend.component';



export class LaharExposureEcuador implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'laharExposureEcuador';
    }

    makeProductMappable(product: RiesgosProductResolved): VectorLayerProduct[] {
        return [{
            ...product,
            description: {
                id: 'selectedRowsGeoJson',
                type: 'complex',
                icon: 'building',
                format: 'application/json',
                name: 'Exposure_ashfall_initial',
                vectorLayerAttributes: {
                    featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
                        const props = feature.getProperties();
                
                        const expo = props.expo;
                        const counts = {
                          'D0': 0,
                          'D1': 0,
                          'D2': 0,
                          'D3': 0
                        };
                        let total = 0;
                        for (let i = 0; i < expo.Damage.length; i++) {
                          const damageClass = expo.Damage[i];
                          const nrBuildings = expo.Buildings[i];
                          counts[damageClass] += nrBuildings;
                          total += nrBuildings;
                        }
                
                        const dr = weightedDamage(Object.values(counts)) / 3;
                
                        let r: number;
                        let g: number;
                        let b: number;
                        let a: number;
                        if (total === 0) {
                          r = b = g = 160;
                          a = 0.9;
                        } else {
                            // [r, g, b] = greenRedRangeStepwise(0, 1, dr);
                            [r, g, b] = [160, 160, 160];
                            a = 0.05;
                        }
                
                        return new olStyle({
                          fill: new olFill({
                            color: [r, g, b, a],
                
                          }),
                          stroke: new olStroke({
                            color: [r, g, b, 1],
                            width: 2
                          })
                        });
                      },
                      detailPopupHtml: (props: object) => {
                        const taxonomies = props['expo']['Taxonomy'];
                        const buildings = props['expo']['Buildings'];
                        const keys = Object.keys(taxonomies);
                        const barchartData: BarData[] = [];
                        for (const key of keys) {
                          barchartData.push({
                            label: taxonomies[key],
                            value: buildings[key]
                          });
                        }
                
                        const anchor = document.createElement('div');
                        const anchorUpdated = createBarChart(anchor, barchartData, 400, 300, '{{ Taxonomy }}', '{{ Buildings }}');
                        return `<h4>{{ Exposure }}</h4>${anchor.innerHTML} {{ BuildingTypesMavrouli }}`;
                      },
                      globalSummary: (value: any) => {
                        const comp: IDynamicComponent = {
                          component: TranslatableStringComponent,
                          inputs: {
                            text: 'BuildingTypesMavrouli'
                          }
                        };
                        return comp;
                      },
                      dynamicLegend: data => ({
                        component: LegendComponent,
                        inputs: {
                          text: 'exposureLegend',
                          entries: [{
                            text: 'Exposure',
                            color: '#c1c1c1'
                          }, {
                            text: 'NoData',
                            color: '#fdfdfd'
                          }],
                          height: 50
                        }
                      }),
                }
            }
        }]
    }

}



export class LaharExposureProvider implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'LaharExposureEcuador';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Ecuador',
            wizardProperties: {
                shape: 'building',
                providerName: 'GFZ',
                providerUrl: 'https://www.gfz-potsdam.de/en/',
                wikiLink: 'ExposureAndVulnerabilityEcuador',
                dataSources: [{label: 'Gobierno Autónomo Descentralizado Provincial de Cotopaxi'}, {label: 'Pittore et al., 2021', href: 'https://dataservices.gfz-potsdam.de/panmetaworks/showshort.php?id=eb481d5a-479b-11ec-947f-3811b03e280f'}]
              }
        };
    }

}
  