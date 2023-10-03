import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved, StepStateTypes } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { TranslatedImageComponent } from "../../tabComponents/legends/translated-image/translated-image.component";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";

export class EqSimulation implements Converter {
    
    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "PeruShort" && step === "EqSimulation";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "EqSimulation")!;
        const vsgrid = state.products.find(p => p.id === "vsgrid")!;
        const gmpe = state.products.find(p => p.id === "gmpe")!;

        return {
            hasFocus: false,
            layerControlables: [],
            oneLayerOnly: true,
            step: step,
            inputs: [{
                formtype: 'string-select',
                label: "vsgrid",
                productId: "vsgrid",
                options: Object.fromEntries(vsgrid.options!.map(v => [v, v])),
                currentValue: vsgrid?.value || vsgrid?.reference
            }, {
                formtype: 'string-select',
                label: "gmpe",
                productId: "gmpe",
                options: Object.fromEntries(gmpe.options!.map(v => [v, v])),
                currentValue: gmpe?.value || gmpe?.reference
            }],
            legend: () => ({
                component: LegendComponent,
                args: {
                    title: 'PGA [g]',
                    entries: [
                        {color: "#FFFFFF", text:"0"      },
                        // {color: "#FFFFFF", text:"0.0005" },
                        {color: "#BFCCFF", text:"0.0015" },
                        // {color: "#A0E6FF", text:"0.0035" },
                        {color: "#80FFFF", text:"0.0075" },
                        // {color: "#7AFF93", text:"0.0150" },
                        {color: "#FFFF00", text:"0.0350" },
                        // {color: "#FFC800", text:"0.0750" },
                        {color: "#FF9100", text:"0.1500" },
                        // {color: "#FF0000", text:"0.3500" },
                        {color: "#C80000", text:"0.7500" },
                        {color: "#800000", text:"1.5000" },
                    ],
                    continuous: true,
                    direction: 'horizontal',
                    labelAngle: 60,
                    width: 180,
                    height: 80,
                    margin: 30,
                    svgContainerStyle: "margin-bottom: -2rem; margin-top: -1rem;"
                }
            })
        };
    }

}