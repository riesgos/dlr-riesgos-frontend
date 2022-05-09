import { MappableProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { Product, ProcessStateUnavailable, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { eqDamagePeruMRef } from './eqDeus';
import { tsWmsPeru } from './tsService';
import { HttpClient } from '@angular/common/http';
import { fragilityRefPeru, VulnerabilityModelPeru } from './modelProp';
import { forkJoin, Observable } from 'rxjs';
import { DeusMetaData } from '../chile/deus';
import { map, switchMap, take } from 'rxjs/operators';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { MapOlService } from '@dlr-eoc/map-ol';
import { LayersService } from '@dlr-eoc/services-layers';
import { LayerMarshaller } from 'src/app/mappable/layer_marshaller';
import { ProductLayer, ProductRasterLayer } from 'src/app/mappable/map.types';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { DamagePopupComponent } from 'src/app/components/dynamic/damage-popup/damage-popup.component';
import { InfoTableComponentComponent } from 'src/app/components/dynamic/info-table-component/info-table-component.component';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { createHeaderTableHtml } from 'src/app/helpers/others';
import { EconomicDamagePopupComponent } from 'src/app/components/dynamic/economic-damage-popup/economic-damage-popup.component';
import { intensityParameter, intensityUnit, Neptunus, tsunamiGeoTiff } from './neptunus';


export const schemaPeru: StringSelectUserConfigurableProduct & WpsData = {
    uid: 'schema',
    description: {
        id: 'schema',
        title: 'schema',
        defaultValue: 'SUPPASRI2013_v2.0',
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
    value: 'SUPPASRI2013_v2.0'
};


export const tsDamageMetaPeru: WpsData & Product = {
    uid: 'peru_tsdamage_metadata',
    description: {
        id: 'meta_summary',
        reference: false,
        title: '',
        type: 'complex',
        format: 'application/json'
    },
    value: null
}

export const tsDamageWmsPeru: WpsData & MappableProduct = {
    uid: 'ts_deus_damage_peru',
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

                const metaData = riesgosState.scenarioData['p1'].productValues.find(p => p.uid === tsDamageMetaPeru.uid);
                const chosenSchema = riesgosState.scenarioData['p1'].productValues.find(p => p.uid === schemaPeru.uid).value;
                const metaDataValue: DeusMetaData = metaData.value[0];

                const econLayer: ProductLayer = layers[0];
                const damageLayer: ProductLayer = new ProductRasterLayer({ ...econLayer });

                econLayer.id += '_economic_peru';
                econLayer.name = 'ts-damage';
                econLayer.icon = 'dot-circle';
                econLayer.params.STYLES = 'style-cum-loss';
                econLayer.legendImg += '&style=style-cum-loss';
                // econLayer.params.STYLES = 'custom_style_economic';
                // econLayer.params.SLD_BODY = customStyleEconomic.replace('{{{{layername}}}}', damageLayer.params.LAYERS);
                const damage = +(metaDataValue.total.loss_value);
                const damageFormatted = toDecimalPlaces(damage / 1000000, 2) + ' MUSD';
                const totalDamage = +(metaDataValue.total.cum_loss);
                const totalDamageFormatted = toDecimalPlaces(totalDamage / 1000000, 2) + ' MUSD';
                econLayer.dynamicDescription = {
                    component: InfoTableComponentComponent,
                    inputs: {
                        // title: 'Total damage',
                        data: [
                            [{ value: 'Loss' },       { value: damageFormatted      }],
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
                                title: 'ts-damage'
                            };
                        }
                    }
                }

                

                damageLayer.id += '_damage_peru';
                damageLayer.name = 'ts-exposure';
                damageLayer.icon = 'dot-circle';
                damageLayer.params = { ...econLayer.params };
                
                if (chosenSchema === 'SUPPASRI2013_v2.0') {
                    damageLayer.legendImg += `&style=style-damagestate-suppasri`;
                    damageLayer.params.STYLES = `style-damagestate-suppasri`;
                    // damageLayer.params.SLD = 'https://gist.githubusercontent.com/MichaelLangbein/b39693d4c4a08850dee6265a6bef72f7/raw/66a30a580e8090a59ab7c1e88bda0740bdf8e1e1/test_sld_medina.xml';
                    // damageLayer.params.STYLES = 'custom_style_suppasri';
                    // damageLayer.params.SLD_BODY = customStyleSuppasri.replace('{{{{layername}}}}', damageLayer.params.LAYERS  );
                } else if (chosenSchema === 'Medina_2019') {
                    damageLayer.legendImg += `&style=style-damagestate-medina`;
                    damageLayer.params.STYLES = 'style-damagestate-medina';
                    // damageLayer.params.SLD_BODY = customStyleMedina.replace('{{{{layername}}}}', damageLayer.params.LAYERS  );
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


export class TsDeusPeru implements ExecutableProcess, WizardableProcess {

    readonly state: ProcessState;
    readonly uid: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly description?: string;
    readonly wizardProperties: WizardProperties;

    private vulnerabilityProcess: VulnerabilityModelPeru;
    private neptunusProcess: Neptunus;

    constructor(http: HttpClient) {
        this.state = new ProcessStateUnavailable();
        this.uid = 'TS-Deus';
        this.name = 'Multihazard_damage_estimation/Tsunami';
        this.requiredProducts = [schemaPeru, tsWmsPeru, eqDamagePeruMRef].map(p => p.uid);
        this.providedProducts = [tsDamageWmsPeru, tsDamageMetaPeru].map(p => p.uid);
        this.description = 'This service returns damage caused by the selected tsunami.';
        this.wizardProperties = {
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle',
            wikiLink: 'ExposureAndVulnerability'
        };

        this.vulnerabilityProcess = new VulnerabilityModelPeru(http);
        this.neptunusProcess = new Neptunus(http);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        // Step 1.1: preparing vulnerability-service inputs
        const vulnerabilityInputs = [inputProducts.find(i => i.uid === schemaPeru.uid)];
        const vulnerabilityOutputs = [fragilityRefPeru];

        // Step 1.2: executing vulnerability-service
        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {

                    // Step 2.1: preparing deus inputs
                    const fragility = resultProducts.find(prd => prd.uid === fragilityRefPeru.uid);
                    const exposure = inputProducts.find(prd => prd.uid === eqDamagePeruMRef.uid);
                    const tsunamiWms = inputProducts.find(prd => prd.uid === tsWmsPeru.uid);

                    // w = 52819m
                    // h = 58820m
                    // m/px = 10
                    // px_w = w / m/px = 5282
                    // px_h = 5882
                    // http://tsunami-wps.awi.de/geoserver/70000011/ows?service=wcs&version=1.0.0&request=GetCoverage&BBOX=-77.39,-12.53,-76.56,-11.69&format=image/geotiff&COVERAGE=70000011_mwhLand_local&CRS=EPSG:4326&WIDTH=2048&HEIGHT=2048
                    const tsunamiWmsUrl = tsunamiWms.value;
                    const layerId = tsunamiWmsUrl.match(/geoserver\/(\d+)\/ows/)[1];
                    const limaBbox = '-77.39,-12.53,-76.56,-11.69';
                    const w = 2048;
                    const h = 2048;
                    const parameter = 'mwhLand_local';
                    let tsunamiGeoTiffRequest = tsunamiWmsUrl.replace('wms', 'WCS');
                    tsunamiGeoTiffRequest = tsunamiGeoTiffRequest.replace('1.3.0', '1.0.0');
                    tsunamiGeoTiffRequest = tsunamiGeoTiffRequest.replace('GetCapabilities', 'GetCoverage');
                    tsunamiGeoTiffRequest += `&format=image/geotiff&COVERAGE=${layerId}_${parameter}&bbox=${limaBbox}&CRS=EPSG:4326&width=${w}&height=${h}`;

                    const neptunusInputs = [{
                        ...schemaPeru,
                        value: 'SARA_v1.0' // <-- because last exposure still used SARA!
                    }, {
                        ...fragility,
                        description: {
                            ...fragilityRefPeru.description,
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
