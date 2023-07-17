import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { MultiLegendComponent } from "../../tabComponents/legends/legendComponents/multi-legend/multi-legend.component";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";
import { yellowRedRange, linInterpolateXY } from "src/app/helpers/colorhelpers";
import { CircleLegendComponent } from "../../tabComponents/legends/legendComponents/circle-legend/circle-legend.component";


export class EqSelection implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "selectEq";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[]): WizardComposite {
        const step = state.steps.find(s => s.step.id === "selectEq")!;
        const inputProd = state.products.find(p => p.id === "userChoice");
        if (!inputProd) return { hasFocus: false, inputs: [], step, layerControlables: [] };

        const outputProd = state.products.find(p => p.id === "selectedEq");

        function eqToLabel(eq: any) {
            const id = eq["properties"]["publicID"].replace("quakeml:quakeledger/peru_", "");
            const mag = eq["properties"]["magnitude.mag.value"];
            const depth = eq["properties"]["origin.depth.value"];
            return `Mag. ${mag}, ${depth}km (${id})`;
        }

        const options = Object.fromEntries(inputProd.options!.map(v => [eqToLabel(v), v]));

        return {
            hasFocus: false,
            inputs: [{
                productId: 'userChoice',
                label: 'eqSelectLabel',
                formtype: 'string-select',
                options: options,
                currentValue: inputProd?.value
            }],
            step: step,
            legend: () => ({
                component: MultiLegendComponent,
                args: {
                    legendComponents: [{
                        component: LegendComponent,
                        args: {
                            title: 'Depth',
                            entries: [{
                                text: '0km',
                                color: `rgb(${yellowRedRange(100, 0, 0).join(', ')})`,
                            }, {
                                text: '30km',
                                color: `rgb(${yellowRedRange(100, 0, 30).join(', ')})`,
                            }, {
                                text: '60km',
                                color: `rgb(${yellowRedRange(100, 0, 60).join(', ')})`,
                            }, {
                                text: '100km',
                                color: `rgb(${yellowRedRange(100, 0, 100).join(', ')})`,
                            }],
                            continuous: true,
                            height: 100,
                            width: 100
                        }
                    }, {
                        component: CircleLegendComponent,
                        args: {
                            title: 'Magnitude',
                            entries: [{
                                label: 'Mag. 6.0',
                                radius: linInterpolateXY(5, 5, 10, 20, 6.0),
                            }, {
                                label: 'Mag. 7.0',
                                radius: linInterpolateXY(5, 5, 10, 20, 7.0),
                            }, {
                                label: 'Mag. 8.0',
                                radius: linInterpolateXY(5, 5, 10, 20, 8.0),
                            }, {
                                label: 'Mag. 9.0',
                                radius: linInterpolateXY(5, 5, 10, 20, 9.0),
                            }],
                            height: 100,
                            width: 100
                        }
                    }]
                }
            }),
            layerControlables: []
        }    
    }
}