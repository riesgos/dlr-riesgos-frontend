import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";


export class EqSelection implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "selectEq";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "selectEq")!;
        const val = data.find(d => d.id === "userChoice");

        return {
            hasFocus: false,
            inputs: [{
                label: 'eq',
                formtype: 'string-select',
                options: val?.options,
                currentValue: val?.value
            }],
            step: step,
        }    
    }
}