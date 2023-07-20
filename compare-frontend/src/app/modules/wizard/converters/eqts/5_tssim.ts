import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";


export class TsSim implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === 'Tsunami';
    }
    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {

        const step = state.steps.find(s => s.step.id === "Tsunami")!;
        const wmsProduct = data.find(p => p.id === "tsWms");
        if (!wmsProduct) return { hasFocus: false, inputs: [], layerControlables: [], step: step };

        return {
            hasFocus: false, // doesn't matter what we set here - will be overridden by wizard-svc
            isAutoPiloted: false, // doesn't matter what we set here - will be overridden by wizard-svc
            layerControlables: [], // doesn't matter what we set here - will be overridden by wizard-svc
            inputs: [],
            step: step,
        };
    }

}

