import { ExecutableProcess, ProcessStateUnavailable, Product, ProcessState } from 'src/app/wps/wps.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable } from 'rxjs';
import { ashfall } from './ashfall';


export const fakeAshfallDamage: Product = {
    uid: 'fakeAshfallDamage',
    description: {},
    value: null
}


export class FakeAshfallDamage implements ExecutableProcess, WizardableProcess {

    state: ProcessState = new ProcessStateUnavailable();
    uid: string = "FakeAshfallDamage";
    name: string = "Ashfall Damage";
    requiredProducts: string[] = [ashfall.uid];
    providedProducts: string[] = [fakeAshfallDamage.uid];
    description?: string = '';
    wizardProperties: WizardProperties = {
        providerName: '',
        providerUrl: '',
        shape: 'dot-circle'
    };

    execute(inputs: Product[], outputs?: Product[], doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {
        throw new Error("Method not implemented.");
    }

}
