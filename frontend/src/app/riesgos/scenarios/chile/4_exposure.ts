import { StringSelectUserConfigurableProduct } from "src/app/components/config_wizard/wizardable_products";
import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { TranslatableStringComponent } from "src/app/components/dynamic/translatable-string/translatable-string.component";
import { UkisMapProduct } from "src/app/components/map/mappable/mappable_products";
import { BarData } from "src/app/helpers/d3charts";
import { MappableProductAugmenter, WizardableProductAugmenter, WizardableStepAugmenter } from "src/app/services/augmenter/augmenter.service";
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from "../../riesgos.state";
import { LegendComponent } from "src/app/components/dynamic/legend/legend.component";
import { ProductLayer } from "src/app/components/map/mappable/map.types";
import { BehaviorSubject, combineLatest, of } from "rxjs";
import { Store } from "@ngrx/store";
import { DataService } from "src/app/services/data/data.service";
import { getProduct } from "../../riesgos.selectors";
import { filter, map, share, shareReplay, switchMap, take } from "rxjs/operators";
import { MapOlService } from "@dlr-eoc/map-ol";
import { LayersService } from "@dlr-eoc/services-layers";
import { HttpClient } from "@angular/common/http";
import { LayerMarshaller } from "src/app/components/map/mappable/layer_marshaller";
import { AsyncBarchartComponent } from "src/app/components/dynamic/async-barchart/async-barchart.component";



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
        },
        options: [
          'ValpCVTBayesian',
          'ValpCommuna',
          'ValpRegularOriginal',
          'ValpRegularGrid',
          'ValpOBM23Comunas',
          'ValpOBM23Region'
        ],
        defaultValue: 'ValpCVTBayesian',
      },
    }];
  }

}

export class InitialExposureChile implements MappableProductAugmenter {
  
  private metadata$ = this.store.select(getProduct('exposureMeta')).pipe(
    shareReplay(),
    switchMap(p => {
        if (p) {
            if (p.reference) return this.resolver.resolveReference(p);
            return of(p);
        }
        return of(undefined);
    }),
    filter(value => value !== undefined && value.value)
  );

  constructor(private store: Store, private resolver: DataService, private http: HttpClient) {}

  
  appliesTo(product: RiesgosProduct): boolean {
    return product.id === 'exposureWmsChile';
  }

  makeProductMappable(product: RiesgosProductResolved): UkisMapProduct[] {

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
      ... product,
      toUkisLayers: (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, httpClient: HttpClient, store: Store, layerMarshaller: LayerMarshaller) => {

        const layers$ = layerMarshaller.makeWmsLayers({
          id: product.id,
          value: product.value[0],
          reference: product.reference,
          description: {
              id: product.id + '_' + 'Exposure',
              name: 'Exposure',
              type: 'literal',
              format: 'application/WMS',
          },
        });

        const metadata$ = this.metadata$.pipe(take(1));

        return combineLatest([layers$, metadata$]).pipe(
            map(([layers, metaData]) => {
                const metaDataValue = metaData.value;
                if (!metaDataValue) {
                    console.error(`No metadata for eq-damage`);
                    // return [];
                }

                const exposureLayer: ProductLayer = layers[0];

                exposureLayer.displayName = 'Exposure';
                exposureLayer.icon = 'building';
                exposureLayer.params.STYLES = 'style-exposure';

                exposureLayer.popup = {
                  dynamicPopup: {
                    component: AsyncBarchartComponent,
                    getAttributes: (args: any) => {

                      const {layer, event} = args;

                      const url = layer.getSource().getFeatureInfoUrl(
                        event.coordinate,
                        event.frameState.viewState.resolution,
                        event.frameState.viewState.projection.getCode(),
                        { 'INFO_FORMAT': 'application/json' }
                      );

                      const barData$ = this.http.get(url).pipe(
                        map((response: any) => {
                          const props = response.features[0].properties;
                          const barData: BarData[] = [];
                          const dictionary = metaDataValue[0].custom_columns;
                          for (const [short, long] of Object.entries(dictionary)) {
                            const label = long as string;
                            const value = props[short];
                            barData.push({
                              label, value, hoverText: `${value} - {{ ${label} }}`
                            });
                          }  
                          return barData;
                        })
                      );
      
                      return {
                        data$: barData$,
                        width: 350,
                        height: 300,
                        xLabel: `Taxonomy`,
                        yLabel: `Buildings`,
                        title: `Exposure`
                      }
                    }
                  }
                };

                exposureLayer.dynamicDescription = globalSummary(product.value[0]);

                exposureLayer.legendImg = dynamicLegend(product.value[0]);

                return [exposureLayer];
          })
        );
      }
    }];
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
        dataSources: [
          { label: 'Gomez-Zapata et al., 2021', href: 'https://dataservices.gfz-potsdam.de/panmetaworks/showshort.php?id=8c3ba5ec-26b3-11ec-9603-497c92695674' },
          { label: 'INE, 2017', href: 'http://www.censo2017.cl/' }
        ],
      }
    }
  }

}

