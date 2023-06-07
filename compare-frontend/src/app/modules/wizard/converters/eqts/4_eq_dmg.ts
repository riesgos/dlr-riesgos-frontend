import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";


export class EqDmg implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "EqDamage";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "EqDamage")!;
        return {
            hasFocus: false, // doesn't matter what we set here - will be overridden by wizard-svc
            isAutoPiloted: false, // doesn't matter what we set here - will be overridden by wizard-svc
            inputs: [],
            step,
            layerControlables: [{ layerCompositeId: "EqDamage-WMS-damage", opacity: 1.0 }, { layerCompositeId: "EqDamage-WMS-econ", opacity: 1.0 }]
            // legend: () => ({
            //     component: LegendComponent,
            //     args: {

            //     }
            // })
        };
    }

}