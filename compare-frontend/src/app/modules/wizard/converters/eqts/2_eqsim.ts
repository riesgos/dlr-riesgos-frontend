import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved, StepStateTypes } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { TranslatedImageComponent } from "../../tabComponents/legends/translated-image/translated-image.component";

export class EqSimulation implements Converter {
    
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "EqSimulation";
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
                component: TranslatedImageComponent,
                args: {
                    languageImageMap: {
                        'EN': 'assets/images/shakemap_pga_legend_labeled.svg',
                        'ES': 'assets/images/shakemap_pga_legend_labeled.svg'
                    }
                }
            })
        };
    }

}