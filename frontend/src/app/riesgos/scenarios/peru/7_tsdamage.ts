import { HttpClient } from "@angular/common/http";
import { MapOlService } from "@dlr-eoc/map-ol";
import { LayersService } from "@dlr-eoc/services-layers";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, forkJoin, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { StringSelectUserConfigurableProduct } from "src/app/components/config_wizard/wizardable_products";
import { WizardableStep } from "src/app/components/config_wizard/wizardable_steps";
import { DamagePopupComponent } from "src/app/components/dynamic/damage-popup/damage-popup.component";
import { EconomicDamagePopupComponent } from "src/app/components/dynamic/economic-damage-popup/economic-damage-popup.component";
import { InfoTableComponentComponent } from "src/app/components/dynamic/info-table-component/info-table-component.component";
import { TranslatableStringComponent } from "src/app/components/dynamic/translatable-string/translatable-string.component";
import { LayerMarshaller } from "src/app/components/map/mappable/layer_marshaller";
import { ProductLayer, ProductRasterLayer } from "src/app/components/map/mappable/map.types";
import { MappableProduct } from "src/app/components/map/mappable/mappable_products";
import { toDecimalPlaces } from "src/app/helpers/colorhelpers";
import { createHeaderTableHtml } from "src/app/helpers/others";
import { WizardableProductAugmenter, MappableProductAugmenter, WizardableStepAugmenter } from "src/app/services/augmenter/augmenter.service";
import { DataService } from "src/app/services/data/data.service";
import { getProduct } from "../../riesgos.selectors";
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from "../../riesgos.state";
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { State } from "src/app/ngrx_register";
import { TranslatedImageComponent } from "src/app/components/dynamic/translated-image/translated-image.component";




export class SchemaTs implements WizardableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'schemaTs';
    }

    makeProductWizardable(product: RiesgosProduct): StringSelectUserConfigurableProduct[] {
        return [{
            ...product,
            description: {
                defaultValue: 'Medina_2019',
                wizardProperties: {
                    fieldtype: 'stringselect',
                    name: 'schema',
                    description: '',
                },
                options: [
                    'SUPPASRI2013_v2.0',
                    'Medina_2019',
                ],
            },
        }]
    }

}


export class TsDamageWmsPeru implements MappableProductAugmenter {

    private tsMetadata$ = new BehaviorSubject<{
        tsMetaData: RiesgosProductResolved | undefined,
        tsSchema: RiesgosProductResolved | undefined
    }>({ tsMetaData: undefined, tsSchema: undefined });

    constructor(private store: Store, private resolver: DataService) {
        const tsDamageSummary$ = this.store.select(getProduct('tsDamageSummary')).pipe(switchMap(p => {
            if (p) {
                if (p.reference) return this.resolver.resolveReference(p);
                return of(p);
            }
            return of(undefined);
        }));
        const tsSchema$ = this.store.select(getProduct('schemaTs')).pipe(switchMap(p => {
            if (p) {
                if (p.reference) return this.resolver.resolveReference(p);
                return of(p);
            }
            return of(undefined);
        }));

        combineLatest([tsDamageSummary$, tsSchema$]).subscribe(([tsMetaData, tsSchema]) => {
            this.tsMetadata$.next({
                tsMetaData, tsSchema
            });
        });
    }

    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'tsDamageWms';
    }

    makeProductMappable(product: RiesgosProductResolved): MappableProduct[] {
        const {tsMetaData, tsSchema} = this.tsMetadata$.value;

        return [{
            ... product,
            
            toUkisLayers: function (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, httpClient: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {
        
                const layers$ = layerMarshaller.makeWmsLayers({
                    id: product.id,
                    value: product.value,
                    reference: product.reference,
                    description: {
                        name: '',
                        id: 'shapefile_summary',
                        type: 'literal',
                        description: '',
                        format: 'application/WMS',
                    },
                });
        
                return layers$.pipe(
                    map((layers) => {
        
                        const chosenSchema = tsSchema.value;
        
                        const econLayer: ProductLayer = layers[0];
                        const damageLayer: ProductLayer = new ProductRasterLayer({ ...econLayer });
        
                        econLayer.id += '_economic_peru';
                        econLayer.name = 'ts-economic-loss-title';
                        econLayer.icon = 'dot-circle';
                        econLayer.params.STYLES = 'style-cum-loss-peru-plasma';
                        const baseLegendEcon = econLayer.legendImg;
                        econLayer.legendImg = {
                            component: TranslatedImageComponent,
                            inputs: {
                                languageImageMap: {
                                    'EN': baseLegendEcon + '&style=style-cum-loss-peru-plasma&language=en',
                                    'ES': baseLegendEcon + '&style=style-cum-loss-peru-plasma',
                                }
                            }
                        };
                        const damage = +(tsMetaData.value.total.loss_value);
                        const damageFormatted = toDecimalPlaces(damage / 1000000, 2) + ' MUSD';
                        const totalDamage = +(tsMetaData.value.total.cum_loss);
                        const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 2) + ' MUSD';
                        econLayer.dynamicDescription = {
                            component: InfoTableComponentComponent,
                            inputs: {
                                // title: 'Total damage',
                                data: [
                                    [{ value: 'Loss' },            { value: damageFormatted      }],
                                    [{ value: 'cumulative_loss' }, { value: totalDamageFormatted }]
                                ],
                                bottomText: `{{ loss_calculated_from }} <a href="./documentation#ExposureAndVulnerability" target="_blank">{{ replacement_costs }}</a>`
                            }
                        }
                        econLayer.popup = {
                            dynamicPopup: {
                                component: EconomicDamagePopupComponent,
                                getAttributes: (args) => {
                                    const event: MapBrowserEvent<any> = args.event;
                                    const layer: TileLayer<TileWMS> = args.layer;
                                    return {
                                        event: event,
                                        layer: layer,
                                        metaData: tsMetaData.value,
                                        title: 'ts-economic-loss-title'
                                    };
                                }
                            }
                        }
        
                        
        
                        damageLayer.id += '_damage_peru';
                        damageLayer.name = 'ts-exposure';
                        damageLayer.icon = 'dot-circle';
                        damageLayer.params = { ...econLayer.params };
                        delete damageLayer.params.SLD_BODY;
                        
                        if (chosenSchema === 'SUPPASRI2013_v2.0') {
                            damageLayer.params.STYLES = `style-damagestate-suppasri-plasma`;
                        } else if (chosenSchema === 'Medina_2019') {
                            damageLayer.params.STYLES = 'style-damagestate-medina-plasma';
                        }

                        let baseLegendDmg = damageLayer.legendImg;
                        if (chosenSchema === 'SUPPASRI2013_v2.0') {
                            baseLegendDmg += `&style=style-damagestate-suppasri-plasma`;
                        } else if (chosenSchema === 'Medina_2019') {
                            baseLegendDmg += `&style=style-damagestate-medina-plasma`;
                        }
                        damageLayer.legendImg = {
                            component: TranslatedImageComponent,
                            inputs: {
                                languageImageMap: {
                                    'EN': baseLegendDmg + '&language=en',
                                    'ES': baseLegendDmg,
                                }
                            }
                        };
        
                        damageLayer.popup = {
                            dynamicPopup: {
                                component: DamagePopupComponent,
                                getAttributes: (args) => {
                                    const event: MapBrowserEvent<any> = args.event;
                                    const layer: TileLayer<TileWMS> = args.layer;
                                    return {
                                        event: event,
                                        layer: layer,
                                        metaData: tsMetaData.value,
                                        xLabel: 'damage',
                                        yLabel: 'Nr_buildings',
                                        schema: chosenSchema,
                                        heading: 'damage_classification_tsunami',
                                        additionalText: chosenSchema === 'Medina_2019' ? 'DamageStatesSara' : 'DamageStatesSuppasri'
                                    };
                                }
                            }
                        };
                        const counts = tsMetaData.value.total.buildings_by_damage_state;
                        let html = createHeaderTableHtml(Object.keys(counts), [Object.values(counts).map((c: number) => toDecimalPlaces(c, 0))]);
                        if (chosenSchema === 'SUPPASRI2013_v2.0') {
                            html += '{{ BuildingTypesSuppasri }}';
                        } else if (chosenSchema === 'Medina_2019') {
                            html += '{{ BuildingTypesMedina }}';
                        }
                        damageLayer.dynamicDescription = {
                            component: TranslatableStringComponent,
                            inputs: {
                                text: html
                            }
                        };
        
        
                        return [econLayer, damageLayer];
                    })
                );
            },
        }];
    }

}


export class TsDeusPeru implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'TsDamage';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Peru',
            wizardProperties: {
                providerName: 'GFZ',
                providerUrl: 'https://www.gfz-potsdam.de/en/',
                shape: 'dot-circle',
                wikiLink: 'ExposureAndVulnerability'
            }
        }
    }

}
