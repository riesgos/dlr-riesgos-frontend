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
import { map, take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_steps';
import { LayerMarshaller } from 'src/app/components/map/mappable/layer_marshaller';
import { ProductLayer, ProductRasterLayer } from 'src/app/components/map/mappable/map.types';
import { State } from 'src/app/ngrx_register';



export class EqDamageWmsPeru implements MappableProductAugmenter {
    appliesTo(product: RiesgosProduct): boolean {
        return product.id === 'eqDamageWms';
    }

    makeProductMappable(product: RiesgosProductResolved): MappableProduct[] {
        return [{
            ... product,
            toUkisLayers: function (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, http: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {

                const riesgosState$ = store.select((state) => state.riesgosState).pipe(take(1));
                const layers$ = layerMarshaller.makeWmsLayers(this);
        
                return forkJoin([layers$, riesgosState$]).pipe(
                    map(([layers, riesgosState]) => {
        
                        const metaData = riesgosState.scenarioData['p1'].products.find(p => p.id === 'eqDamageSummary');
                        const metaDataValue = metaData.value[0];
        
                        const econLayer: ProductLayer = layers[0];
                        const damageLayer: ProductLayer = new ProductRasterLayer({ ... econLayer });
        
                        econLayer.id += '_economic';
                        econLayer.name = 'eq-economic-loss-title';
                        econLayer.icon = 'dot-circle';
                        econLayer.params.STYLES = 'style-cum-loss-peru-plasma';
                        econLayer.legendImg += '&style=style-cum-loss-peru-plasma';
                        const totalDamage = +(metaDataValue.total.loss_value);
                        const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 2) + ' MUSD';
                        econLayer.dynamicDescription = {
                            component: InfoTableComponentComponent,
                            inputs: {
                                // title: 'Total damage',
                                data: [[{value: 'Loss'}, {value: totalDamageFormatted}]],
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
                                        metaData: metaData.value[0],
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
                        damageLayer.legendImg += '&style=style-damagestate-sara-plasma';
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
                                        metaData: metaData.value[0],
                                        xLabel: 'damage',
                                        yLabel: 'Nr_buildings',
                                        schema: 'SARA_v1.0',
                                        heading: 'earthquake_damage_classification',
                                        additionalText: 'DamageStatesSara'
                                    };
                                }
                            }
                        };
                        const counts = metaDataValue.total.buildings_by_damage_state;
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
                wikiLink: 'ExposureAndVulnerability'
            }
        }
    }

}
