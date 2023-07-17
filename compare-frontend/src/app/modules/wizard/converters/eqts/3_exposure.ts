import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";


export class Exposure implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "Exposure";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "Exposure")!;
        const inputProd = step.step.inputs[0];
        const currentValue = state.products.find(p => p.id === inputProd.id)?.value;

        return {
            hasFocus: false,
            inputs: [{
                formtype: "string-select",
                label: "exposure model",
                productId: inputProd.id,
                options: Object.fromEntries(inputProd.options!.map(v => [v, v])),
                currentValue: currentValue
            }],
            step: step,
            legend: () => ({
                component: LegendComponent,
                args: {
                    text: 'exposureLegend',
                    entries: [{
                    text: 'Exposure',
                    color: '#fdfdfd'
                    }, {
                    text: 'NoData',
                    color: '#c1c1c1'
                    }],
                    height: 50,
                    width: 130
                }
            }),
            layerControlables: [{ layerCompositeId: "exposureLayer", visible: true }]
        }
    }

}