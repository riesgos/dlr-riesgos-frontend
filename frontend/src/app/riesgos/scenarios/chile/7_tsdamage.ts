import { MappableProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { Product, ProcessStateUnavailable, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableStep, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { tsWms } from './6_tssim';
import { HttpClient } from '@angular/common/http';
import { fragilityRef, VulnerabilityModel } from './modelProp';
import { forkJoin, Observable } from 'rxjs';
import { DeusMetaData } from './deus';
import { map, switchMap, take } from 'rxjs/operators';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { MapOlService } from '@dlr-eoc/map-ol';
import { LayersService } from '@dlr-eoc/services-layers';
import { LayerMarshaller } from 'src/app/mappable/layer_marshaller';
import { ProductLayer, ProductRasterLayer } from 'src/app/mappable/map.types';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { eqDamageMRef } from './5_eqdamage';
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { DamagePopupComponent } from 'src/app/components/dynamic/damage-popup/damage-popup.component';
import { InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { createHeaderTableHtml } from 'src/app/helpers/others';
import { EconomicDamagePopupComponent } from 'src/app/components/dynamic/economic-damage-popup/economic-damage-popup.component';
import { intensityParameter, intensityUnit, Neptunus, tsunamiGeoTiff } from '../peru/neptunus';



export const schema: StringSelectUserConfigurableProduct & WpsData = {
    uid: 'schema',
    description: {
        id: 'schema',
        title: 'schema',
        defaultValue: 'Medina_2019',
        reference: false,
        type: 'literal',
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
    value: 'Medina_2019'
};


export const tsDamageMeta: WpsData & Product = {
    uid: 'chile_tsdamage_metadata',
    description: {
        id: 'meta_summary',
        reference: false,
        title: '',
        type: 'complex',
        format: 'application/json'
    },
    value: null
}

export const tsDamageWms: WpsData & MappableProduct = {
    uid: 'ts_deus_damage',
    description: {
        id: 'shapefile_summary',
        title: '',
        reference: false,
        type: 'complex',
        description: '',
        format: 'application/WMS',
    },
    toUkisLayers: function (ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, httpClient: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {

        const riesgosState$ = store.select((state) => state.riesgosState).pipe(take(1));
        const layers$ = layerMarshaller.makeWmsLayers(this);

        return forkJoin([layers$, riesgosState$]).pipe(
            map(([layers, riesgosState]) => {

                const metaData = riesgosState.scenarioData['c1'].products.find(p => p.uid === tsDamageMeta.uid);
                const chosenSchema = riesgosState.scenarioData['c1'].products.find(p => p.uid === schema.uid).value;
                const metaDataValue: DeusMetaData = metaData.value[0];

                const econLayer: ProductLayer = layers[0];
                const damageLayer: ProductLayer = new ProductRasterLayer({...econLayer });

                econLayer.id += '_economic';
                econLayer.name = 'ts-economic-loss-title';
                econLayer.icon = 'dot-circle';
                econLayer.params.STYLES = 'style-cum-loss-chile-plasma';
                econLayer.legendImg += '&style=style-cum-loss-chile-plasma';
                const damage = +(metaDataValue.total.loss_value);
                const damageFormatted = toDecimalPlaces(damage / 1000000, 2) + ' MUSD';
                const totalDamage = +(metaDataValue.total.cum_loss);
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
                                metaData: metaData.value[0],
                                title: 'ts-economic-loss-title'
                            };
                        }
                    }
                }

                damageLayer.id += '_damage';
                damageLayer.name = 'ts-exposure';
                damageLayer.icon = 'dot-circle';
                damageLayer.params = { ...econLayer.params };
                delete damageLayer.params.SLD_BODY;
                
                if (chosenSchema === 'SUPPASRI2013_v2.0') {
                    damageLayer.legendImg += `&style=style-damagestate-suppasri-plasma`;
                    damageLayer.params.STYLES = `style-damagestate-suppasri-plasma`;
                } else if (chosenSchema === 'Medina_2019') {
                    damageLayer.legendImg += `&style=style-damagestate-medina-plasma`;
                    damageLayer.params.STYLES = 'style-damagestate-medina-plasma';
                }

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
                                schema: chosenSchema,
                                heading: 'damage_classification_tsunami',
                                additionalText: chosenSchema === 'Medina_2019' ? 'DamageStatesSara' : 'DamageStatesSuppasri'
                            };
                        }
                    }
                };
                const counts = metaDataValue.total.buildings_by_damage_state;
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
    value: null
}



export class TsDeus implements ExecutableProcess, WizardableStep {

    readonly state: ProcessState;
    readonly uid: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly description?: string;
    readonly wizardProperties: WizardProperties;

    private vulnerabilityProcess: VulnerabilityModel;
    private neptunusProcess: Neptunus;

    constructor(http: HttpClient, middleWareUrl: string) {
        this.state = new ProcessStateUnavailable();
        this.uid = 'TS-Deus';
        this.name = 'Multihazard_damage_estimation/Tsunami';
        this.requiredProducts = [schema, tsWms, eqDamageMRef].map(p => p.uid);
        this.providedProducts = [tsDamageWms, tsDamageMeta].map(p => p.uid);
        this.description = 'ts_damage_svc_description';
        this.wizardProperties = {
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle',
            wikiLink: 'ExposureAndVulnerability'
        };

        this.vulnerabilityProcess = new VulnerabilityModel(http, middleWareUrl);
        this.neptunusProcess = new Neptunus(http, middleWareUrl);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        // Step 1.1: preparing vulnerability-service inputs
        const vulnerabilityInputs = [inputProducts.find(i => i.uid === schema.uid)];
        const vulnerabilityOutputs = [fragilityRef];

        // Step 1.2: executing vulnerability-service
        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {

                    // Step 2.1: preparing deus inputs
                    const fragility = resultProducts.find(prd => prd.uid === fragilityRef.uid);
                    const exposure = inputProducts.find(prd => prd.uid === eqDamageMRef.uid);
                    const tsunamiWms = inputProducts.find(prd => prd.uid === tsWms.uid);

                    const tsunamiWmsUrl = tsunamiWms.value;
                    const layerId = tsunamiWmsUrl.match(/geoserver\/(\d+)\/ows/)[1];
                    const valpaBbox = '-71.939,-33.371,-71.205,-32.848';
                    const w = 2048;
                    const h = 2048;
                    const parameter = 'mwhLand_local';
                    let tsunamiGeoTiffRequest = tsunamiWmsUrl.replace('wms', 'WCS');
                    tsunamiGeoTiffRequest = tsunamiGeoTiffRequest.replace('1.3.0', '1.0.0');
                    tsunamiGeoTiffRequest = tsunamiGeoTiffRequest.replace('GetCapabilities', 'GetCoverage');
                    tsunamiGeoTiffRequest += `&format=image/geotiff&COVERAGE=${layerId}_${parameter}&bbox=${valpaBbox}&CRS=EPSG:4326&width=${w}&height=${h}`;

                    
                    const neptunusInputs = [{
                        ...schema,
                        value: 'SARA_v1.0' // <-- because last exposure still used SARA!
                    }, {
                        ...fragility,
                        description: {
                            ...fragilityRef.description,
                            id: 'fragility'
                        }
                    }, {
                        ...exposure,
                        description: {
                            ...exposure.description,
                            id: 'exposure'
                        },
                    },
                    intensityParameter,
                    intensityUnit,
                    {
                        ...tsunamiGeoTiff,
                        value: tsunamiGeoTiffRequest
                    }];
                    const neptunusOutputs = outputProducts;

                    // Step 2.2: executing deus
                    return this.neptunusProcess.execute(neptunusInputs, neptunusOutputs, doWhileExecuting);
                })
            );
    }
}
