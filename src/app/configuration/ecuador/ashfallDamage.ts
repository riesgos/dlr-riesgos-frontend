import { ExecutableProcess, Product, ProcessState, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VulnerabilityModelEcuador, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './vulnerability';
import { Volcanus } from './volcanus';
import { switchMap } from 'rxjs/operators';
import { initialExposure } from '../chile/exposure';
import { ashfall } from './ashfall';
import { WpsData, WpsDataDescription } from '@ukis/services-wps/src/public-api';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { schemaEcuador } from './exposure';
import { fragilityRef } from '../chile/modelProp';
import { FeatureCollection } from '@turf/helpers';


export const ashfallDamage: WpsData & VectorLayerData = {
    uid: 'ashfallDamage',
    description: {
        id: 'damage',
        name: 'ashfallDamage',
        format: 'application/json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: () => {},
            text: () => {},
            summary: (value: [FeatureCollection]) => {return 'style'}
        }
    },
    value: null
};

export const ashfallTransition: WpsData & VectorLayerData = {
    uid: 'ashfallTransition',
    description: {
        id: 'transition',
        name: 'ashfallTransition',
        format: 'application/json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: () => {},
            text: () => {},
            summary: (value: [FeatureCollection]) => {return 'style'}
        }
    },
    value: null
};

export const ashfallUpdatedExposure: WpsData & VectorLayerData = {
    uid: 'ashfallExposure',
    description: {
        id: 'updated_exposure',
        name: 'ashfallExposure',
        format: 'application/json',
        reference: false,
        type: 'complex',
        vectorLayerAttributes: {
            style: () => {},
            text: () => {},
            summary: (value: [FeatureCollection]) => {return 'style'}
        }
    },
    value: null
};

export const ashfallUpdatedExposureRef: WpsData & Product = {
    uid: 'ashfallExposureRef',
    description: {
        id: 'updated_exposure',
        reference: true,
        type: 'complex',
        format: 'application/json'
    },
    value: null
};



export class DeusAshfall implements ExecutableProcess, WizardableProcess {

    readonly uid: string = 'DeusAshfall';
    readonly name: string = 'Ashfall Damage';
    readonly state: ProcessState = new ProcessStateUnavailable();
    readonly requiredProducts: string[] =
        [initialExposure, ashfall].map(p => p.uid);
    readonly providedProducts: string[] =
        [ashfallDamage, ashfallTransition, ashfallUpdatedExposure, ashfallUpdatedExposureRef].map(p => p.uid);
    readonly description?: string = 'Deus Ashfall description';
    readonly wizardProperties: WizardProperties = {
        shape: 'dot-circle',
        providerName: 'Helmholtz Centre Potsdam',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    };

    private volcanus: Volcanus;
    private vulnerability: VulnerabilityModelEcuador;

    constructor(http: HttpClient) {
        this.volcanus = new Volcanus(http);
        this.vulnerability = new VulnerabilityModelEcuador(http);
    }

    execute(
        inputs: Product[], outputs?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void
    ): Observable<Product[]> {

        const vulnInputs = [{
            ... schemaEcuador,
            value: 'Torres_Corredor_et_al_2017'
        }, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador];
        const vulnOutputs = [fragilityRef];

        return this.vulnerability.execute(vulnInputs, vulnOutputs, doWhileExecuting).pipe(
            switchMap((results: Product[]) => {
                const fragility = results.find(prd => prd.uid === fragilityRef.uid);
                const shakemap = inputs.find(prd => prd.uid === ashfall.uid);
                const exposure = inputs.find(prd => prd.uid === initialExposure.uid);

                const vulcInputs: Product[] = [{
                    ... shakemap,
                    description: {
                        ... shakemap.description as WpsDataDescription,
                        id: 'intensity'
                    }
                }, {
                    uid: 'intensitycolumn',
                    description: {
                        id: 'intensitycolumn',
                        type: 'literal',
                        reference: false
                    },
                    value: 'thickness'
                }, {
                    ... exposure,
                    description: {
                        ... exposure.description,
                        id: 'exposure'
                    },
                    value: exposure.value[0]
                }, {
                    ... schemaEcuador,
                    value: 'Torres_Corredor_et_al_2017'
                }, {
                    ... fragility,
                    description: {
                        ... fragilityRef.description,
                        id: 'fragility'
                    }
                }
                ];

                const vulcOutputs = [ashfallDamage, ashfallTransition, ashfallUpdatedExposure, ashfallUpdatedExposureRef];

                return this.volcanus.execute(vulcInputs, vulcOutputs, doWhileExecuting);
            })
        );
    }
}
