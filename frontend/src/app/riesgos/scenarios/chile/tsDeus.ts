import { WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { Product, ProcessStateUnavailable, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { eqDamageWms, eqDamageMRef } from './eqDeus';
import { tsShakemap } from './tsService';
import { HttpClient } from '@angular/common/http';
import { fragilityRef, VulnerabilityModel } from './modelProp';
import { Observable } from 'rxjs';
import { Deus } from './deus';
import { switchMap } from 'rxjs/operators';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';



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

export const tsDamageWms: WpsData & WmsLayerProduct = {
    uid: 'ts_deus_damage',
    description: {
        id: 'shapefile_summary',
        title: '',
        reference: false,
        type: 'complex',
        description: '',
        format: 'application/WMS',
        name: 'ts-exposure',
        styles: ['w_damage']
    },
    value: null
}

export const tsEconomicWms: WpsData & WmsLayerProduct = {
    uid: 'ts_deus_economic',
    description: {
        id: 'shapefile_summary',
        title: '',
        reference: false,
        type: 'complex',
        description: '',
        format: 'application/WMS',
        name: 'ts-damage',
        styles: ['style']
    },
    value: null
}

export const tsTransitionWms: WpsData & WmsLayerProduct = {
    uid: 'ts_deus_transitions',
    description: {
        id: 'shapefile_summary',
        title: '',
        reference: false,
        type: 'complex',
        description: '',
        format: 'application/WMS',
        name: 'ts-transitions',
        styles: ['m_trans']
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
        this.requiredProducts = [eqDamageWms, tsShakemap, eqDamageMRef, schema].map(p => p.uid);
        this.providedProducts = [tsDamageWms, tsEconomicWms, tsTransitionWms].map(p => p.uid);
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
