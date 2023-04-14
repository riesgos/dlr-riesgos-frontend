import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";


export class EqSelection implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "selectEq";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "selectEq")!;
        const val = state.products.find(p => p.id === "userChoice");
        if (!val) return { hasFocus: false, inputs: [], step };

        const options = Object.fromEntries(val.options!.map(v => [v.id, v]));

        return {
            hasFocus: false,
            inputs: [{
                productId: 'userChoice',
                label: 'eq',
                formtype: 'string-select',
                options: options,
                currentValue: val?.value
            }],
            step: step,
        }    
    }
}