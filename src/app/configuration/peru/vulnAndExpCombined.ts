import { ExecutableProcess, ProcessStateUnavailable, Product, ProcessState } from 'src/app/wps/wps.datatypes';
import { Observable, forkJoin } from 'rxjs';
import { ExposureModelPeru } from './exposure';
import { VulnerabilityModelPeru } from './modelProp';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';




export class VulnerabilityAndExposurePeru implements ExecutableProcess, WizardableProcess {

    readonly uid = 'VulnerabilityAndExposure';
    readonly name = 'Exposure (extended)';

    private vulnerabilityModel: VulnerabilityModelPeru;
    private exposureModel: ExposureModelPeru;
    readonly requiredProducts: string[];
    readonly providedProducts: string[];
    readonly wizardProperties: WizardProperties;
    readonly state: ProcessState;

    constructor(private httpClient: HttpClient) {
        this.vulnerabilityModel = new VulnerabilityModelPeru(httpClient);
        this.exposureModel = new ExposureModelPeru(httpClient);

        this.requiredProducts = this.vulnerabilityModel.requiredProducts.concat(this.exposureModel.requiredProducts);
        this.providedProducts = this.vulnerabilityModel.providedProducts.concat(this.exposureModel.providedProducts);
        this.wizardProperties = this.exposureModel.wizardProperties;

        this.state = new ProcessStateUnavailable();
    }

    execute = (inputs: Product[], outputs: Product[], doWhileExecuting): Observable<Product[]> => {

        const inputsVul = inputs.filter(i => this.vulnerabilityModel.requiredProducts.includes(i.uid));
        const outputsVul = outputs.filter(i => this.vulnerabilityModel.providedProducts.includes(i.uid));
        const inputsExp = inputs.filter(i => this.exposureModel.requiredProducts.includes(i.uid));
        const outputsExp = outputs.filter(i => this.exposureModel.providedProducts.includes(i.uid));

        const proc1$ = this.vulnerabilityModel.execute(inputsVul, outputsVul, doWhileExecuting);
        const proc2$ = this.exposureModel.execute(inputsExp, outputsExp, doWhileExecuting);

        return forkJoin([proc1$, proc2$]).pipe(
            map((results: Product[][]) => {
                const flattened: Product[] = [];
                for (const result of results) {
                    for (const data of result) {
                        flattened.push(data);
                    }
                }
                return flattened;
            })
        );
    }

}
