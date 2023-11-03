import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";
import { MultiLegendComponent } from "../../tabComponents/legends/legendComponents/multi-legend/multi-legend.component";

export class SysRel implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "PeruShort" && step === "SysRel";
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
               return  {
                    component: MultiLegendComponent,
                    args: [{
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
                    }, {
                        component: LegendComponent,
                        args: {
                            title: 'Powerlines',
                            entries: [{
                                text: 'Linea',
                                color: `rgb(240, 149, 52)`,
                            }, {
                                text: 'Derivacion',
                                color: `rgb(230, 229, 69)`,
                            }],
                            continuous: false,
                            height: 40,
                            width: 150,
                        }
                    }, {
                        component: LegendComponent,
                        args: {
                            title: 'SIGRID water',
                            entries: [{
                                text: 'Red primaria',
                                color: `rgb(0, 0, 0)`,
                            }, {
                                text: 'Red secundaria',
                                color: `rgb(0, 95, 223)`,
                            }, {
                                text: 'Alcantarillado',
                                color: `rgb(208, 4, 248)`,
                            }],
                            continuous: false,
                            height: 60,
                            width: 150,
                        }
                    }],
                };
            }
        }
    }

}