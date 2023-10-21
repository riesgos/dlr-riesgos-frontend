import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { MultiLegendComponent } from "../../tabComponents/legends/legendComponents/multi-legend/multi-legend.component";
import { ImageLegendComponent } from "../../tabComponents/legends/image-legend/image-legend.component";


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
                component: MultiLegendComponent,
                args: {
                    legendComponents: [{
                        component: ImageLegendComponent,
                        args: {
                            title: 'mwhLand_local',
                            url: 'https://riesgos.52north.org/tsuna_geoserver/70000011/ows?REQUEST=GetLegendGraphic&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYER=70000011_mwhLand_local&STYLES=default',
                        }
                    // }, {
                    //     component: ImageLegendComponent,
                    //     args: {
                    //         title: 'mwh',
                    //         url: 'https://riesgos.52north.org/tsuna_geoserver/70000011/ows?REQUEST=GetLegendGraphic&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&BGCOLOR=0xFFFFFF&TRANSPARENT=TRUE&LAYER=70000011_mwh&STYLES=default',
                    //     }
                    }]
                }
            })
        };
    }

}

