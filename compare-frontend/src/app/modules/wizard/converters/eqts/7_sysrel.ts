import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";

export class SysRel implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "SysRel";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "SysRel")!;
        const datum = data.find(d => d.id === "sysRel");
        if (!datum) return {hasFocus: false, inputs: [], step, layerControlables: []};

        return {
            hasFocus: false, // doesn't matter what we set here - will be overridden by wizard-svc
            isAutoPiloted: false, // doesn't matter what we set here - will be overridden by wizard-svc
            inputs: [],
            step,
            layerControlables: [{
                layerCompositeId: "damage_consumer_areas",
                opacity: 1.0
            }],
        }
    }

}