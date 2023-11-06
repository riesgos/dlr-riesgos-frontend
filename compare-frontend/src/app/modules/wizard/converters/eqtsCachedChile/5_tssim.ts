import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { MultiLegendComponent } from "../../tabComponents/legends/legendComponents/multi-legend/multi-legend.component";
import { ImageLegendComponent } from "../../tabComponents/legends/image-legend/image-legend.component";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";


export class CachedWizardTsSimChile implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === 'TsunamiChile';
    }
    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {

        const step = state.steps.find(s => s.step.id === "TsunamiChile")!;
        const wmsProduct = data.find(p => p.id === "tsWmsChile");
        if (!wmsProduct) return { hasFocus: false, inputs: [], layerControlables: [], step: step, oneLayerOnly: false };

        return {
            hasFocus: false, // doesn't matter what we set here - will be overridden by wizard-svc
            isAutoPiloted: false, // doesn't matter what we set here - will be overridden by wizard-svc
            layerControlables: [], // doesn't matter what we set here - will be overridden by wizard-svc
            oneLayerOnly: false,
            inputs: [],
            step: step,
            legend: () => ({
                component: LegendComponent,
                args: {
                    title: 'mwhLand_local',
                    entries: [{
                        text: '0.10 m',
                        color: `rgb(44, 151, 184)`,
                    }, {
                        text: '0.5 m',
                        color: `rgb(161, 218, 180)`,
                    }, {
                        text: '1.0 m',
                        color: `rgb(231, 253, 112)`,
                    }, {
                        text: '5.0 m',
                        color: `rgb(255, 149, 59)`,
                    }, {
                        text: '15.0 m',
                        color: `rgb(255, 0, 0)`
                    }],
                    continuous: true,
                    height: 100,
                    width: 100
                }
            })
        };
    }

}

