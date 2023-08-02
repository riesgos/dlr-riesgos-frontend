import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";

export class SysRel implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "SysRel";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "SysRel")!;
        const datum = data.find(d => d.id === "sysRel");
        if (!datum) return {hasFocus: false, inputs: [], step, layerControlables: [], oneLayerOnly: false};

        return {
            hasFocus: false, // doesn't matter what we set here - will be overridden by wizard-svc
            isAutoPiloted: false, // doesn't matter what we set here - will be overridden by wizard-svc
            layerControlables: [], // doesn't matter what we set here - will be overridden by wizard-svc
            oneLayerOnly: true,
            inputs: [],
            step,
            legend: () => {
                return {
                    component: LegendComponent,
                    args: {
                        entries: [{
                            text: 'Prob. 0.0',
                            color: '#00ff00'
                          }, {
                            text: 'Prob. 0.5',
                            color: '#fdfd7d'
                          }, {
                            text: 'Prob. 1.0',
                            color: '#ff0000'
                        }],
                        continuous: true,
                        height: 90
                    }
                }
            }
        }
    }

}