import { MappableProduct, WmsLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { Product, ProcessStateUnavailable, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { tsShakemap } from './tsService';
import { HttpClient } from '@angular/common/http';
import { fragilityRef, VulnerabilityModel } from './modelProp';
import { Observable } from 'rxjs';
import { Deus } from './deus';
import { map, switchMap } from 'rxjs/operators';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { MapOlService } from '@dlr-eoc/map-ol';
import { LayersService } from '@dlr-eoc/services-layers';
import { LayerMarshaller } from 'src/app/mappable/layer_marshaller';
import { ProductLayer, ProductRasterLayer } from 'src/app/mappable/map.types';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { eqDamageMRef } from './eqDeus';



export const schema: StringSelectUserConfigurableProduct & WpsData = {
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
    toUkisLayers: function(ownValue: any, mapSvc: MapOlService, layerSvc: LayersService, httpClient: HttpClient, store: Store<State>, layerMarshaller: LayerMarshaller) {
        return layerMarshaller.makeWmsLayers(this).pipe(
            map(layers => {
                const tsDamage = layers[0];
                const tsTransitions = { ... tsDamage } as ProductRasterLayer;
                const tsEconomic = { ... tsDamage } as ProductRasterLayer;
                tsDamage.name = 'ts-exposure';
                tsDamage.params.STYLES = 'w_damage';
                tsTransitions.name = 'ts-transitions';
                tsTransitions.params.STYLE = 'm_trans';
                tsEconomic.name = 'ts-damage';
                tsEconomic.description = `{{ damages_calculated_from }} <a href="./documentation#ExposureAndVulnerability" target="_blank">{{ replacement_costs }}</a>`;
                

                return [tsDamage, tsTransitions, tsEconomic];
            })
        );
    },
    value: null
}



export class TsDeus implements ExecutableProcess, WizardableProcess {

    readonly state: ProcessState;
    readonly uid: string;
    readonly name: string;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly description?: string;
    readonly wizardProperties: WizardProperties;

    private vulnerabilityProcess: VulnerabilityModel;
    private deusProcess: Deus;

    constructor(http: HttpClient) {
        this.state = new ProcessStateUnavailable();
        this.uid = 'TS-Deus';
        this.name = 'Multihazard_damage_estimation/Tsunami';
        this.requiredProducts = [tsShakemap, eqDamageMRef, schema].map(p => p.uid);
        this.providedProducts = [tsDamageWms].map(p => p.uid);
        this.description = 'This service returns damage caused by the selected tsunami.';
        this.wizardProperties = {
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle',
            wikiLink: 'ExposureAndVulnerability'
        };

        this.vulnerabilityProcess = new VulnerabilityModel(http);
        this.deusProcess = new Deus(http);
    }

    execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

        // Step 1.1: preparing vulnerability-service inputs
        const vulnerabilityInputs = [inputProducts.find(i => i.uid === schema.uid)];
        const vulnerabilityOutputs = [ fragilityRef ];

        // Step 1.2: executing vulnerability-service
        return this.vulnerabilityProcess.execute(vulnerabilityInputs, vulnerabilityOutputs, doWhileExecuting)
            .pipe(
                switchMap((resultProducts: Product[]) => {

                    // Step 2.1: preparing deus inputs
                    const fragility = resultProducts.find(prd => prd.uid === fragilityRef.uid);
                    const shakemap = inputProducts.find(prd => prd.uid === tsShakemap.uid);
                    const exposure = inputProducts.find(prd => prd.uid === eqDamageMRef.uid);

                    const deusInputs = [{
                            ... schema,
                            value:  'SARA_v1.0' // <-- because last exposure still used SARA!
                        }, {
                            ... fragility,
                            description: {
                                ... fragilityRef.description,
                                id: 'fragility'
                            }
                        }, {
                            ... shakemap,
                            description: {
                                ...shakemap.description,
                                format: 'text/xml',
                                id: 'intensity'
                            }
                        }, {
                            ... exposure,
                            description: {
                                ... exposure.description,
                                id: 'exposure'
                            },
                        }
                    ];
                    const deusOutputs = outputProducts;

                    // Step 2.2: executing deus
                    return this.deusProcess.execute(deusInputs, deusOutputs, doWhileExecuting);
                })
            );
    }
}
