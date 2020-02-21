import { ExecutableProcess, Product, ProcessState, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable } from 'rxjs';
import { Volcanus } from './volcanus';
import { VulnerabilityModelEcuador, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './vulnerability';
import { switchMap } from 'rxjs/operators';
import { laharVelocityShakemapRef } from './laharWrapper';
import { HttpClient } from '@angular/common/http';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { WpsData } from '@ukis/services-ogc';
import { FeatureCollection } from '@turf/helpers';
import { schemaEcuador } from './exposure';
import { fragilityRef } from '../chile/modelProp';
import { Deus } from '../chile/deus';
import { ashfallUpdatedExposureRef } from './ashfallDamage';
import { laharDamage, laharTransition, laharUpdatedExposure, laharUpdatedExposureRef } from './laharDamage';



export const laharAshfallDamage = {
    ... laharDamage,
    description: {
        ... laharDamage.description,
        name: 'Lahar and Ashfall Damage',
    },
    uid: 'laharAshfallDamage'
};

export const laharAshfallTransition = {
    ... laharTransition,
    description: {
        ... laharTransition.description,
        name: 'Lahar and Ashfall Transition',
    },
    uid: 'laharAshfallTransition'
};

export const laharAshfallUpdatedExposure = {
    ... laharUpdatedExposure,
    description: {
        ... laharUpdatedExposure.description,
        name: 'Lahar and Ashfall Exposure',
    },
    uid: 'laharAshfallExposure'
};




export class DeusLaharAndAshfall implements ExecutableProcess, WizardableProcess {

    readonly uid: string = 'DeusLaharAndAshfall';
    readonly name: string = 'Lahar and Ashfall Damage';
    readonly state: ProcessState = new ProcessStateUnavailable();
    readonly requiredProducts: string[] = [ashfallUpdatedExposureRef, laharUpdatedExposureRef, laharVelocityShakemapRef].map(p => p.uid);
    readonly providedProducts: string[] = [laharAshfallDamage, laharAshfallTransition, laharAshfallUpdatedExposure].map(p => p.uid);
    readonly description?: string = 'Deus Lahar + Ashfall description';
    readonly wizardProperties: WizardProperties = {
        shape: 'dot-circle',
        providerName: 'Helmholtz Centre Potsdam',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    };

    private deus: Deus;
    private vulnerability: VulnerabilityModelEcuador;

    constructor(http: HttpClient) {
        this.deus = new Deus(http);
        this.vulnerability = new VulnerabilityModelEcuador(http);
    }

    execute(
        inputs: Product[], outputs?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void
    ): Observable<Product[]> {

        const vulnInputs = [{
            ... schemaEcuador,
            value: 'Mavrouli_et_al_2014',
        }, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador];
        const vulnOutputs = [fragilityRef];

        return this.vulnerability.execute(vulnInputs, vulnOutputs, doWhileExecuting).pipe(
            switchMap((results: Product[]) => {
                const fragility = results.find(prd => prd.uid === fragilityRef.uid);
                const shakemap = inputs.find(prd => prd.uid === laharVelocityShakemapRef.uid);
                const exposure = inputs.find(prd => prd.uid === ashfallUpdatedExposureRef.uid);

                const deusInputs: Product[] = [{
                    ... shakemap,
                    description: {
                        ... shakemap.description,
                        format: 'text/xml',
                        id: 'intensity'
                    }
                },
                {
                    ... exposure,
                    description: {
                        ... exposure.description,
                        id: 'exposure'
                    },
                    value: exposure.value
                }, {
                    ... schemaEcuador,
                    value: 'Torres_Corredor_et_al_2017',
                }, {
                    ... fragility,
                    description: {
                        ... fragilityRef.description,
                        id: 'fragility'
                    }
                }
                ];

                const deusOutputs = [laharAshfallDamage, laharAshfallTransition, laharAshfallUpdatedExposure];

                return this.deus.execute(deusInputs, deusOutputs, doWhileExecuting);
            })
        );
    }
}
