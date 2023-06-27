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
            inputs: [],
            step: step,
            layerControlables: [
                {layerCompositeId: "mwh", opacity: 1.0 },
                {layerCompositeId: "mwhLand_global", opacity: 1.0 },
                {layerCompositeId: "mwhLand_local", opacity: 1.0 },
                {layerCompositeId: "arrivalTimes", opacity: 0.5 },
            ]
        };
    }

}

