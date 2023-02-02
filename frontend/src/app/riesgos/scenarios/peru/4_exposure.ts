import { StringSelectUserConfigurableProduct } from "src/app/components/config_wizard/wizardable_products";
import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { TranslatableStringComponent } from "src/app/components/dynamic/translatable-string/translatable-string.component";
import { UkisMapProduct } from "src/app/components/map/mappable/mappable_products";
import { weightedDamage } from "src/app/helpers/colorhelpers";
import { BarData } from "src/app/helpers/d3charts";
import { MappableProductAugmenter, WizardableProductAugmenter, WizardableStepAugmenter } from "src/app/services/augmenter/augmenter.service";
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from "../../riesgos.state";
import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import { LegendComponent } from "src/app/components/dynamic/legend/legend.component";
import { Feature as olFeature, Collection as olCollection } from 'ol';
import { GeoJSON } from 'ol/format';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import { Vector as olVectorSource } from 'ol/source';
import { WebGlPolygonLayer } from "src/app/helpers/custom_renderers/renderers/polygon.renderer";
import { ProductCustomLayer } from "src/app/components/map/mappable/map.types";
import { of } from "rxjs";
import { downloadJson } from "src/app/helpers/others";
import { BarchartComponent } from "src/app/components/dynamic/barchart/barchart.component";


export class ModelChoicePeru implements WizardableProductAugmenter {
  appliesTo(product: RiesgosProduct): boolean {
    return product.id === 'exposureModelName';
  }

  makeProductWizardable(product: RiesgosProduct): StringSelectUserConfigurableProduct[] {
    return [{
      ...product,
      description: {
        wizardProperties: {
          fieldtype: 'stringselect',
          name: 'model',
          description: 'exposure model',
          // signpost: 'warning_processing_time'
        },
        options: [
          'LimaCVT1_PD30_TI70_5000',
          'LimaCVT2_PD30_TI70_10000',
          'LimaCVT3_PD30_TI70_50000',
          'LimaCVT4_PD40_TI60_5000',
          'LimaCVT5_PD40_TI60_10000',
          'LimaCVT6_PD40_TI60_50000',
          'LimaBlocks',
        ],
        defaultValue: 'LimaCVT1_PD30_TI70_5000',
      },
    }];
  }

}

export class InitialExposurePeru implements MappableProductAugmenter {

  appliesTo(product: RiesgosProduct): boolean {
    return product.id === 'exposure';
  }

  makeProductMappable(product: RiesgosProductResolved): UkisMapProduct[] {

    const featureStyle = (feature: olFeature<Geometry>, resolution: number) => {
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
    }
    const dynamicLegend = data => ({
      component: LegendComponent,
      inputs: {
        text: 'exposureLegend',
        entries: [{
          text: 'Exposure',
          color: '#fdfdfd'
        }, {
          text: 'NoData',
          color: '#c1c1c1'
        }],
        height: 50
      }
    });
    const globalSummary = value => {
      return {
        component: TranslatableStringComponent,
        inputs: {
          text: 'BuildingTypesSaraExtensive'
        }
      };
    };


    return [{
      ...product,
      toUkisLayers(ownValue, mapSvc, layerSvc, httpClient, store, layerMarshaller) {


        const data = ownValue;
        const source = new olVectorSource<Polygon>({
          features: new GeoJSON({
            dataProjection: 'EPSG:4326',
            featureProjection: mapSvc.map.getView().getProjection().getCode()
          }).readFeatures(data) as any
        });

        const vl = new WebGlPolygonLayer({
          source,
          webGlColorFunction: (f: olFeature<Polygon>) => {
            const style = featureStyle(f, null)
            // @ts-ignore
            const fillColor = style.fill_.color_;
            return [fillColor[0] / 255, fillColor[1] / 255, fillColor[2] / 255, fillColor[3]];
          }
        });
      
        const ukisLayer = new ProductCustomLayer({
          custom_layer: vl,
          productId: product.id,
          id: product.id + '_' + 'Exposure',
          name: 'Exposure',
          opacity: 1.0,
          visible: true,
          attribution: '',
          type: 'custom',
          removable: true,
          continuousWorld: true,
          time: null,
          filtertype: 'Overlays',
          icon: 'building',
          hasFocus: false,
          popup: {
            dynamicPopup: {
              component: BarchartComponent,
              getAttributes: (args: any) => {
                const props = args['properties'];
                const expo = props['expo'];

                const data: BarData[] = [];
                for (let i = 0; i < Object.values(expo.Taxonomy).length; i++) {
                  const tax = expo['Taxonomy'][i]; // .match(/^[a-zA-Z]*/)[0];
                  const bld = expo['Buildings'][i];
                  if (!data.map(dp => dp.label).includes(tax)) {
                    data.push({
                      label: tax,
                      value: bld,
                      hoverText: `${bld} - {{ ${tax} }}`
                    });
                  } else {
                    data.find(dp => dp.label === tax).value += bld;
                  }
                }

                return {
                  data: data,
                  width: 350,
                  height: 300,
                  xLabel: `Taxonomy`,
                  yLabel: `Buildings`,
                  title: `Exposure`
                }
              }
            }
          },
          actions: [{
            icon: 'download',
            title: 'download',
            action: (theLayer: any) => {
              const geojsonParser = new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: mapSvc.map.getView().getProjection().getCode()
              });
              const olFeatures = theLayer.custom_layer.getSource().getFeatures();
              const data = JSON.parse(geojsonParser.writeFeatures(olFeatures));
              if (data) {
                downloadJson(data, `data_${theLayer.name}.json`);
              }
            }
          }],
          dynamicDescription: globalSummary(product.value),
          legendImg: dynamicLegend(product.value)
        });


        // Ugly hack: a custom layer is not supposed to have an 'options' property.
        // We set it here anyway, because we need options.style to be able to create a custom legend.
        ukisLayer['options'] = {
          style: (feature: olFeature<Geometry>, resolution: number) => {
            const props = feature.getProperties();
            return featureStyle(feature, resolution);
          }
        };

        return of([ukisLayer]);
      },
    }];
  }

}

export class ExposureModelPeru implements WizardableStepAugmenter {
  appliesTo(step: RiesgosStep): boolean {
    return step.step.id === 'Exposure'
  }
  makeStepWizardable(step: RiesgosStep): WizardableStep {
    return {
      ...step,
      scenario: 'Peru',
      wizardProperties: {
        shape: 'building',
        providerName: 'GFZ',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        wikiLink: 'ExposureAndVulnerability',
        dataSources: [
          { label: 'Gomez-Zapata, 2021', href: 'https://dataservices.gfz-potsdam.de/panmetaworks/showshort.php?id=8c3ba5ec-26b3-11ec-9603-497c92695674' },
          { label: 'INEI, 2017', href: 'http://censo2017.inei.gob.pe/' }
        ],
      }
    }
  }

}

