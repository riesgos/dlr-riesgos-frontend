import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";
import { TextComponent } from "../../tabComponents/legends/text/text.component";


export class CachedExposure implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "PeruCached" && step === "Exposure";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "Exposure")!;

        return {
            hasFocus: false, 
            layerControlables: [],
            oneLayerOnly: true,
            inputs: [],
            step: step,
            info: () => ({
                component: TextComponent,
                args: {
                    body: 'exposureLegend',
                }
            }),
        }
    }

}