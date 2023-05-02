import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';
import { createHeaderTableHtml } from 'src/app/helpers/others';
import { EconomicDamagePopupComponent } from 'src/app/components/dynamic/economic-damage-popup/economic-damage-popup.component';
import { MappableProductAugmenter, WizardableStepAugmenter } from 'src/app/services/augmenter/augmenter.service';
import { MappableProduct } from 'src/app/components/map/mappable/mappable_products';
import { RiesgosProduct, RiesgosProductResolved, RiesgosStep } from '../../riesgos.state';
import { DamagePopupComponent } from 'src/app/components/dynamic/damage-popup/damage-popup.component';
import { MapOlService } from '@dlr-eoc/map-ol';
import { LayersService } from '@dlr-eoc/services-layers';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { LayerMarshaller } from 'src/app/components/map/mappable/layer_marshaller';
import { ProductLayer, ProductRasterLayer } from 'src/app/components/map/mappable/map.types';
import { DataService } from 'src/app/services/data/data.service';
import { getProduct } from '../../riesgos.selectors';
import { TranslatedImageComponent } from 'src/app/components/dynamic/translated-image/translated-image.component';



export class EqDamageWmsPeru implements MappableProductAugmenter {

    private metadata$ = new BehaviorSubject<RiesgosProductResolved | undefined>(undefined);

    constructor(private store: Store, private resolver: DataService) {
        this.store.select(getProduct('eqDamageSummary')).pipe(
            switchMap(p => {
                if (p) {
                    if (p.reference) return this.resolver.resolveReference(p);
                    return of(p);
                }
                return of(undefined);
            }),
        )
        .subscribe((aeqs: RiesgosProductResolved | undefined) => {
            this.metadata$.next(aeqs);
        });
    }

    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqDamageWms';
    }

    makeProductMappable(product: RiesgosProductResolved): MappableProduct[] {
        
        return [{
            ... product,
            toUkisLayers: (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, http: HttpClient, store: Store, layerMarshaller: LayerMarshaller) => {

                const layers$ = layerMarshaller.makeWmsLayers({
                    id: product.id,
                    value: product.value,
                    reference: product.reference,
                    description: {
                        id: 'shapefile_summary',
                        name: 'shapefile_summary',
                        type: 'literal',
                        format: 'application/WMS',
                    },
                });
        
                return combineLatest([layers$, this.metadata$.pipe(take(1))]).pipe(
                    map(([layers, metaData]) => {
                        const metaDataValue = metaData.value;

                        const econLayer: ProductLayer = layers[0];
                        const damageLayer: ProductLayer = new ProductRasterLayer({ ... econLayer });
        
                        econLayer.id += '_economic';
                        econLayer.name = 'eq-economic-loss-title';
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
                        const totalDamage = +(metaDataValue?.total?.loss_value) || 0.0;
                        const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 2) + ' MUSD';
                        econLayer.dynamicDescription = {
                            component: InfoTableComponentComponent,
                            inputs: {
                                // title: 'Total damage',
                                data: [[{value: 'Loss'}, {value: totalDamageFormatted}]],
                                bottomText: `{{ loss_calculated_from }} <a href="./#/documentation#ExposureAndVulnerability" target="_blank">{{ replacement_costs }}</a>`
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
                                        metaData: metaDataValue,
                                        title: 'eq-economic-loss-title'
                                    };
                                }
                            }
                        }
        
                        
                        damageLayer.id += '_damage';
                        damageLayer.name = 'eq-exposure';
                        damageLayer.icon = 'dot-circle';
                        damageLayer.params = { ... econLayer.params };
                        damageLayer.params.STYLES = 'style-damagestate-sara-plasma';
                        const baseLegendDmg = damageLayer.legendImg;
                        damageLayer.legendImg = {
                            component: TranslatedImageComponent,
                            inputs: {
                                languageImageMap: {
                                    'EN': baseLegendDmg + '&style=style-damagestate-sara-plasma&language=en',
                                    'ES': baseLegendDmg + '&style=style-damagestate-sara-plasma',
                                }
                            }
                        };
                        delete damageLayer.params.SLD_BODY;
                        damageLayer.popup = {
                            dynamicPopup: {
                                component: DamagePopupComponent,
                                getAttributes: (args) => {
                                    const event: MapBrowserEvent<any> = args.event;
                                    const layer: TileLayer<TileWMS> = args.layer;
                                    return {
                                        event: event,
                                        layer: layer,
                                        metaData: metaDataValue,
                                        xLabel: 'damage',
                                        yLabel: 'Nr_buildings',
                                        schema: 'SARA_v1.0',
                                        heading: 'earthquake_damage_classification',
                                        additionalText: 'DamageStatesSara'
                                    };
                                }
                            }
                        };
                        const counts = metaDataValue?.total?.buildings_by_damage_state || 0.0;
                        const html =
                            createHeaderTableHtml(Object.keys(counts), [Object.values(counts).map((c: number) => toDecimalPlaces(c, 0))])
                            + '{{ BuildingTypesSaraExtensive }}';
        
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

export class EqDeusPeru implements WizardableStepAugmenter {
    appliesTo(step: RiesgosStep): boolean {
        return step.step.id === 'EqDamage';
    }

    makeStepWizardable(step: RiesgosStep): WizardableStep {
        return {
            ...step,
            scenario: 'Peru',
            wizardProperties: {
                providerName: 'GFZ',
                providerUrl: 'https://www.gfz-potsdam.de/en/',
                shape: 'dot-circle' as 'dot-circle',
                wikiLink: 'ExposureAndVulnerability',
                dataSources: [{ label: "DEUS", href: "https://dataservices.gfz-potsdam.de/panmetaworks/showshort.php?id=d38d2b34-d5ba-11eb-9603-497c92695674" }]
            }
        }
    }

}
