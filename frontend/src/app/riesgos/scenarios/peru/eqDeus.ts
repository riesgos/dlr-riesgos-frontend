import { ProcessStateUnavailable, Product, ExecutableProcess, ProcessState } from 'src/app/riesgos/riesgos.datatypes';
import { initialExposurePeruReference } from './exposure';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { HttpClient } from '@angular/common/http';
import { fragilityRefPeru, VulnerabilityModelPeru } from './modelProp';
import { eqShakemapRefPeru } from './shakyground';
import { Observable } from 'rxjs';
import { Deus } from '../chile/deus';
import { switchMap } from 'rxjs/operators';




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

export const eqDamageWmsPeru: WpsData & WmsLayerProduct = {
    uid: 'eq_deus_damage_peru',
    description: {
        id: 'shapefile_summary',
        title: '',
        reference: false,
        type: 'complex',
        description: '',
        format: 'application/WMS',
        name: 'eq-exposure',
        styles: ['w_damage']
    },
    value: null
}

export const eqEconomicWmsPeru: WpsData & WmsLayerProduct = {
    uid: 'eq_deus_economic_peru',
    description: {
        id: 'shapefile_summary',
        title: '',
        reference: false,
        type: 'complex',
        description: '',
        format: 'application/WMS',
        name: 'eq-damage',
        styles: ['style']
    },
    value: null
}

export const eqDamagePeruMRef: WpsData & Product = {
    uid: 'merged_output_ref_peru',
    description: {
        id: 'merged_output',
        title: 'Updated exposure',
        reference: true,
        type: 'complex',
        format: 'application/json',
        description: 'NumberGoodsInDamageState'
    },
    value: null
};

export class EqDeusPeru implements ExecutableProcess, WizardableProcess {

    readonly state: ProcessState;
    readonly uid = 'EQ-Deus';
    readonly name = 'Multihazard_damage_estimation/Earthquake';
    readonly requiredProducts = [eqShakemapRefPeru, initialExposurePeruReference].map(p => p.uid);
    readonly providedProducts = [eqDamageWmsPeru, eqEconomicWmsPeru, eqDamagePeruMRef].map(p => p.uid);
    readonly description = 'This service returns damage caused by the selected earthquake.';
    readonly wizardProperties = {
        providerName: 'GFZ',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        shape: 'dot-circle' as 'dot-circle',
        wikiLink: 'ExposureAndVulnerability'
    };

    private vulnerabilityProcess: VulnerabilityModelPeru;
    private deusProcess: Deus;

    constructor(http: HttpClient) {
        this.state = new ProcessStateUnavailable();
        this.vulnerabilityProcess = new VulnerabilityModelPeru(http);
        this.deusProcess = new Deus(http);
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
                defaultValue: 'SARA_v1.0',
                reference: false,
                type: 'literal'
            },
            value: 'SARA_v1.0'
        };

        const vulnerabilityInputs = [schemaPeru];
        const vulnerabilityOutputs = [fragilityRefPeru];

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
