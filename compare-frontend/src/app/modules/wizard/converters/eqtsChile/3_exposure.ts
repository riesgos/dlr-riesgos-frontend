import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { TextComponent } from "../../tabComponents/legends/text/text.component";


export class WizardExposureChile implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "ChileShort" && step === "ExposureChile";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "ExposureChile")!;
        const inputProd = step.step.inputs[0];
        const currentValue = state.products.find(p => p.id === inputProd.id)?.value;

        return {
            hasFocus: false, 
            layerControlables: [],
            oneLayerOnly: true,
            inputs: [{
                formtype: "string-select",
                label: "exposure model",
                productId: inputProd.id,
                options: Object.fromEntries(inputProd.options!.map(v => [v, v])),
                currentValue: currentValue
            }],
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