import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { TranslatedImageComponent } from "../../tabComponents/legends/translated-image/translated-image.component";
import { TranslationService } from "src/app/services/translation.service";
import { Injectable } from "@angular/core";

@Injectable()
export class CachedSysRel implements Converter {

    constructor(private translate: TranslationService) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "PeruCached" && step === "SysRel";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "SysRel")!;
        const datum = data.find(d => d.id === "sysRel");
        if (!datum) return {hasFocus: false, inputs: [], step, layerControlables: [], oneLayerOnly: false};

        const wms = new URL(datum.value);
        const baseLegend = `${wms.origin}/${wms.pathname}?REQUEST=GetLegendGraphic&SERVICE=WMS&VERSION=1.1.1&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYER=${wms.searchParams.get('LAYERS')}`;


        return {
            hasFocus: false, // doesn't matter what we set here - will be overridden by wizard-svc
            isAutoPiloted: false, // doesn't matter what we set here - will be overridden by wizard-svc
            layerControlables: [], // doesn't matter what we set here - will be overridden by wizard-svc
            oneLayerOnly: true,
            inputs: [],
            step,
            legend: () => {
                return {
                    component: TranslatedImageComponent,
                        args: {
                            title: this.translate.translate('Prob_Interuption'),
                            languageImageMap: {
                                'EN': baseLegend + '&language=en',
                                'ES': baseLegend + '',
                            }
                        }
                }
            }
        }
    }

}