import { ProcessStateUnavailable, Product, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { initialExposurePeruReference } from './4_exposure';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { WizardableStep } from 'src/app/components/config_wizard/wizardable_processes';
import { MappableProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { fragilityRefPeru, VulnerabilityModelPeru } from './modelProp';
import { eqShakemapRefPeru } from './3_eqsim';
import { Deus } from '../chile/deus';
import { map, switchMap, take } from 'rxjs/operators';
import { ProductLayer, ProductRasterLayer } from 'src/app/mappable/map.types';
import { MapOlService } from '@dlr-eoc/map-ol';
import { LayersService } from '@dlr-eoc/services-layers';
import { LayerMarshaller } from 'src/app/mappable/layer_marshaller';
import { DamagePopupComponent } from 'src/app/components/dynamic/damage-popup/damage-popup.component';
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';
import { createHeaderTableHtml } from 'src/app/helpers/others';
import { EconomicDamagePopupComponent } from 'src/app/components/dynamic/economic-damage-popup/economic-damage-popup.component';





export const lossPeru: WpsData & Product = {
    uid: 'lossPeru',
    description: {
        id: 'loss',
        title: '',
        reference: false,
        type: 'literal'
    },
    value: 'testinputs/loss_sara.json'
};

export const eqDamageWmsPeru: WpsData & MappableProduct = {
    uid: 'eq_deus_damage_peru',
    description: {
        id: 'shapefile_summary',
        title: 'shapefile_summary',
        reference: false,
        type: 'complex',
        format: 'application/WMS',
    },
    toUkisLayers: function (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, http: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {

        const riesgosState$ = store.select((state) => state.riesgosState).pipe(take(1));
        const layers$ = layerMarshaller.makeWmsLayers(this);

        return forkJoin([layers$, riesgosState$]).pipe(
            map(([layers, riesgosState]) => {

                const metaData = riesgosState.scenarioData['p1'].products.find(p => p.uid === eqDamageMetaPeru.uid);
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
    value: null
}


export const eqDamageMetaPeru: WpsData & Product = {
    uid: 'peru_eqdamage_metadata',
    description: {
        id: 'meta_summary',
        reference: false,
        title: '',
        type: 'complex',
        format: 'application/json'
    },
    value: null
}

export const eqDamagePeruMRef: WpsData & Product = {
    uid: 'merged_output_ref_peru',
    description: {
        id: 'merged_output',
        title: '',
        reference: true,
        type: 'complex',
        format: 'application/json'
    },
    value: null
};

export class EqDeusPeru implements ExecutableProcess, WizardableStep {

    readonly state: ProcessState;
    readonly uid = 'EQ-Deus';
    readonly name = 'Multihazard_damage_estimation/Earthquake';
    readonly requiredProducts = [eqShakemapRefPeru, initialExposurePeruReference].map(p => p.uid);
    readonly providedProducts = [eqDamageWmsPeru, eqDamageMetaPeru, eqDamagePeruMRef].map(p => p.uid);
    readonly description = 'eq_damage_svc_description';
    readonly wizardProperties = {
        providerName: 'GFZ',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        shape: 'dot-circle' as 'dot-circle',
        wikiLink: 'ExposureAndVulnerability'
    };

    private vulnerabilityProcess: VulnerabilityModelPeru;
    private deusProcess: Deus;

    constructor(http: HttpClient, middleWareUrl: string) {
        this.state = new ProcessStateUnavailable();
        this.vulnerabilityProcess = new VulnerabilityModelPeru(http, middleWareUrl);
        this.deusProcess = new Deus(http, middleWareUrl);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        const schemaPeru: Product & WpsData = {
            uid: 'schema',
            description: {
                id: 'schema',
                title: 'schema',
                reference: false,
                type: 'literal',
            },
            value: 'SARA_v1.0'
        };

        const vulnerabilityInputs = [ schemaPeru ];
        const vulnerabilityOutputs = [ fragilityRefPeru ];

        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {
                    const fragility = resultProducts.find(prd => prd.uid === fragilityRefPeru.uid);
                    const shakemap = inputProducts.find(prd => prd.uid === eqShakemapRefPeru.uid);
                    const exposure = inputProducts.find(prd => prd.uid === initialExposurePeruReference.uid);

                    const deusInputs = [{
                        ...schemaPeru,
                        value: 'SARA_v1.0'
                    }, {
                        ...fragility,
                        description: {
                            ...fragility.description,
                            id: 'fragility'
                        }
                    }, {
                        ...shakemap,
                        description: {
                            ...shakemap.description,
                            id: 'intensity'
                        }
                    }, {
                        ...exposure,
                        description: {
                            ...exposure.description,
                            id: 'exposure'
                        }
                    }];
                    const deusOutputs = outputProducts;
                    return this.deusProcess.execute(deusInputs, deusOutputs, doWhileExecuting);
                })
            );
    }
}
