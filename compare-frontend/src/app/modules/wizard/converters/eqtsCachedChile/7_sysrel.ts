import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { TranslatedImageComponent } from "../../tabComponents/legends/translated-image/translated-image.component";
import { TranslationService } from "src/app/services/translation.service";
import { Injectable } from "@angular/core";
import { MultiLegendComponent } from "../../tabComponents/legends/legendComponents/multi-legend/multi-legend.component";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";

@Injectable()
export class CachedWizardSysRelChile implements Converter {

    constructor(private translate: TranslationService) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "ChileCached" && step === "SysRelChile";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "SysRelChile")!;
        const datum = data.find(d => d.id === "sysRelChile");
        if (!datum) return {hasFocus: false, inputs: [], step, layerControlables: [], oneLayerOnly: false};

        const wms = new URL(datum.value);


        return {
            hasFocus: false, // doesn't matter what we set here - will be overridden by wizard-svc
            isAutoPiloted: false, // doesn't matter what we set here - will be overridden by wizard-svc
            layerControlables: [], // doesn't matter what we set here - will be overridden by wizard-svc
            oneLayerOnly: false,
            inputs: [],
            step,
            legend: () => {
                return {
                    component: MultiLegendComponent,
                    args: {
                        legendComponents: [{
                            component: LegendComponent,
                            args: {
                                title: this.translate.translate('Prob_Interuption'),
                                entries: [{
                                    text: '0 % - 25 %',
                                    color: `rgb(236, 234, 197)`,
                                }, {
                                    text: '25 % - 50 %',
                                    color: `rgb(218, 179, 155)`,
                                }, {
                                    text: '50 % - 75 %',
                                    color: `rgb(195, 139, 136)`,
                                }, {
                                    text: '75 % - 100 %',
                                    color: `rgb(163, 125, 137)`,
                                },],
                                continuous: false,
                                height: 80,
                                width: 150,
                            }
                        }],
                        direction: 'vertical'
                    }
                }
            }
        }
    }

}