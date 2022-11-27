import { StringSelectUserConfigurableProduct } from "src/app/components/config_wizard/wizardable_products";
import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { TranslatableStringComponent } from "src/app/components/dynamic/translatable-string/translatable-string.component";
import { MappableProduct, VectorLayerProduct } from "src/app/components/map/mappable/mappable_products";
import { weightedDamage } from "src/app/helpers/colorhelpers";
import { BarData, createBigBarChart } from "src/app/helpers/d3charts";
import { MappableProductAugmenter, WizardableProductAugmenter, WizardableStepAugmenter } from "src/app/services/augmenter/augmenter.service";
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from "../../riesgos.state";
import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import olFeature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';



export class ModelChoiceChile implements WizardableProductAugmenter {
  appliesTo(product: RiesgosProduct): boolean {
    return product.id === 'exposureModelNameChile';
  }

  makeProductWizardable(product: RiesgosProduct): StringSelectUserConfigurableProduct[] {
    return [{
      ... product,
      description: {
        wizardProperties: {
          fieldtype: 'stringselect',
          name: 'model',
          description: 'exposure model',
          // signpost: 'warning_processing_time'
        },
        options: [
          'ValpCVTBayesian',
          'ValpCommuna',
          'ValpRegularOriginal',
          'ValpRegularGrid'
        ],
        defaultValue: 'ValpCVTBayesian',
      },
    }];
  }

}

export class InitialExposureChile implements MappableProductAugmenter {
  
  appliesTo(product: RiesgosProduct): boolean {
    return product.id === 'exposureChile';
  }

  makeProductMappable(product: RiesgosProductResolved): VectorLayerProduct[] {
    return [{
      ... product,
      description: {
        id: 'selectedRowsGeoJson',
        icon: 'building',
        type: 'complex',
        format: 'application/json',
        name: 'Exposure',
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
    
            const dr = weightedDamage(Object.values(counts)) / 4;
    
            let r: number;
            let g: number;
            let b: number;
            let a: number;
            if (total === 0) {
              r = b = g = 160;
              a = 0.9;
            } else {
              // [r, g, b] = greenRedRange(0, 1, dr);
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
    
            const expo = props['expo'];
    
            const data: BarData[] = [];
            for (let i = 0; i < Object.values(expo.Taxonomy).length; i++) {
              const tax = expo['Taxonomy'][i]; // .match(/^[a-zA-Z]*/)[0];
              const bld = expo['Buildings'][i];
              if (!data.map(dp => dp.label).includes(tax)) {
                data.push({
                  label: tax,
                  value: bld
                });
              } else {
                data.find(dp => dp.label === tax).value += bld;
              }
            }
    
            const anchor = document.createElement('div');
            const anchorUpdated = createBigBarChart(anchor, data, 350, 300, '{{ Taxonomy }}', '{{ Buildings }}');
            return `<h4>{{ Exposure }}</h4>${anchor.innerHTML}`;
          },
          legendEntries: [{
            feature: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [[[5.627918243408203, 50.963075942052164], [5.627875328063965, 50.958886259879264], [5.635471343994141, 50.95634523633128], [5.627918243408203, 50.963075942052164]]]
              },
              properties: {
                expo: {
                  Damage: [],
                  Buildings: []
                }
              }
            },
            text: `exposureLegend`
          }],
          globalSummary: (value) => {
            return {
              component: TranslatableStringComponent,
              inputs: {
                text: 'BuildingTypesSaraExtensive'
              }
            };
          }
        }
      },
    }]
  }

}

export class ExposureModelChile implements WizardableStepAugmenter {
  appliesTo(step: RiesgosStep): boolean {
    return step.step.id === 'ExposureChile'
  }
  makeStepWizardable(step: RiesgosStep): WizardableStep {
    return {
      ...step,
      scenario: 'Chile',
      wizardProperties: {
        shape: 'building',
        providerName: 'GFZ',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        wikiLink: 'ExposureAndVulnerability',
        dataSources: [{ label: 'Gomez-Zapata, 2021', href: 'https://dataservices.gfz-potsdam.de/panmetaworks/showshort.php?id=8c3ba5ec-26b3-11ec-9603-497c92695674' }, { label: 'INEI, 2017', href: 'http://censo2017.inei.gob.pe/' }],
      }
    }
  }

}

