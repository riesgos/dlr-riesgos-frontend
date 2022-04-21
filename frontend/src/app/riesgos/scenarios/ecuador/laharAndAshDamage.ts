import { ExecutableProcess, Product, ProcessState, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable } from 'rxjs';
import { VulnerabilityModelEcuador, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador } from './vulnerability';
import { map, switchMap } from 'rxjs/operators';
import { laharVelocityShakemapRef } from './laharWrapper';
import { HttpClient } from '@angular/common/http';
import { MultiVectorLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { schemaEcuador } from './exposure';
import { fragilityRef } from '../chile/modelProp';
import { Deus } from '../chile/deus';
import { ashfallDamageM, ashfallDamageMRef } from './ashfallDamage';
import { laharLossProps, laharTransitionProps, laharUpdatedExposureProps, laharDamageMRef } from './laharDamage';
import { createGroupedBarChart, BarData } from 'src/app/helpers/d3charts';



const laharAshfallLossProps = {
    ... laharLossProps,
    name: 'Lahar_and_Ashfall_Loss',
};

const laharAshfallTransitionProps = {
    ... laharTransitionProps,
    name: 'LaharAndAshfallTransition',
};

const laharAshfallUpdatedExposureProps = {
    ... laharUpdatedExposureProps,
    vectorLayerAttributes: {
        ... laharUpdatedExposureProps.vectorLayerAttributes,
        text: (props: object) => {
            const anchor = document.createElement('div');
            const expo = props['expo'];

            const data: {[groupName: string]: BarData[]} = {};
            for (let i = 0; i < expo['Taxonomy'].length; i++) {
                const dmg = expo['Damage'][i];
                const tax = expo['Taxonomy'][i];
                const bld = expo['Buildings'][i];
                if (!data[tax]) {
                    data[tax] = [];
                }
                data[tax].push({
                    label: dmg,
                    value: bld
                });
            }

            for (const label in data) {
                if (data[label]) {
                    data[label].sort((dp1, dp2) => dp1.label > dp2.label ? 1 : -1);
                }
            }

            const anchorUpdated = createGroupedBarChart(anchor, data, 400, 300, '{{ taxonomy_DX }}', '{{ nr_buildings }}');
            return `<h4 style="color: var(--clr-p1-color, #666666);">{{ LaharAndAshfall }}: {{ damage_classification }}</h4>${anchor.innerHTML} {{ DamageStatesMavrouli }}{{StatesNotComparable}}`;
        },
    },
    name: 'LaharAndAshfallExposure',
};

export const laharAshfallDamageM: WpsData & MultiVectorLayerProduct = {
    uid: 'lahar_ashfall_damage_output_values',
    description: {
        id: 'merged_output',
        title: '',
        reference: false,
        defaultValue: null,
        format: 'application/json',
        type: 'complex',
        description: '',
        vectorLayers: [laharAshfallUpdatedExposureProps, laharAshfallLossProps]
    },
    value: null
};


export class DeusLaharAndAshfall implements ExecutableProcess, WizardableProcess {

    readonly uid: string = 'DeusLaharAndAshfall';
    readonly name: string = 'LaharAndAshfallDamage';
    readonly state: ProcessState = new ProcessStateUnavailable();
    readonly requiredProducts: string[] = [ashfallDamageM, ashfallDamageMRef, laharDamageMRef, laharVelocityShakemapRef].map(p => p.uid);
    readonly providedProducts: string[] = [laharAshfallDamageM].map(p => p.uid);
    readonly description?: string = 'Deus Lahar + Ashfall description';
    readonly wizardProperties: WizardProperties = {
        shape: 'dot-circle',
        providerName: 'GFZ',
        providerUrl: 'https://www.gfz-potsdam.de/en/',
        wikiLink: 'ExposureAndVulnerabilityEcuador'
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

        // Step 1.1: Preparing vulnerability-service inputs
        const vulnInputs = [{
            ... schemaEcuador,
            value: 'Mavrouli_et_al_2014',
        }, assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador];
        const vulnOutputs = [fragilityRef];

        // Step 1.2: executing vulnerability service
        return this.vulnerability.execute(vulnInputs, vulnOutputs, doWhileExecuting).pipe(
            switchMap((results: Product[]) => {

                // Step 2.1: Preparing deus inputs
                const fragility = results.find(prd => prd.uid === fragilityRef.uid);
                const shakemap = inputs.find(prd => prd.uid === laharVelocityShakemapRef.uid);
                const exposure = inputs.find(prd => prd.uid === ashfallDamageMRef.uid);

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

                const deusOutputs: Product[] = [laharAshfallDamageM];

                // Step 2.2: executing deus
                return this.deus.execute(deusInputs, deusOutputs, doWhileExecuting);
            }),
            map((results: Product[]) => {
                // Step 3: adding losses-by-ashfall to losses-from-ashfall-to-lahar
                const lossesByAshfall = inputs.find(i => i.uid === ashfallDamageM.uid).value[0];
                const lossesFromAshfallToLahar = results[0].value[0];
                for (let i = 0; i < lossesFromAshfallToLahar.features.length; i++) {
                    lossesFromAshfallToLahar.features[i].properties['loss_value'] += lossesByAshfall.features[i].properties['loss_value'];
                }
                return results;
            })
        );
    }
}
