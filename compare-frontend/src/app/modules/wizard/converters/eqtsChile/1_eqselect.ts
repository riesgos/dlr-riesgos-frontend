import { PartitionName, RiesgosProductResolved, RiesgosScenarioState, RiesgosState, ScenarioName } from "src/app/state/state";
import { Converter } from "../../converter.service";
import { WizardComposite } from "../../wizard.service";
import { MultiLegendComponent } from "../../tabComponents/legends/legendComponents/multi-legend/multi-legend.component";
import { LegendComponent } from "../../tabComponents/legends/legendComponents/legend/legend.component";
import { yellowRedRange, linInterpolateXY } from "src/app/helpers/colorhelpers";
import { CircleLegendComponent } from "../../tabComponents/legends/legendComponents/circle-legend/circle-legend.component";
import { Injectable } from "@angular/core";
import { ResolverService } from "src/app/services/resolver.service";
import { BehaviorSubject, filter, map, switchMap } from "rxjs";
import { Store } from "@ngrx/store";


@Injectable()
export class WizardEqSelectionChile implements Converter {

    private riesgosState$ = new BehaviorSubject<RiesgosState | undefined>(undefined);
    private leftEqSelect$ = new BehaviorSubject<RiesgosProductResolved | undefined>(undefined);

    constructor(
        private store: Store<{ riesgos: RiesgosState }>,
        private resolver: ResolverService
    ) {
        this.store.select(state => state.riesgos).subscribe(this.riesgosState$);
        this.riesgosState$.pipe(
            filter(state => !!state),
            map(state => {
                const leftScenarioData = state!.scenarioData.ChileShort!.left!;
                const eqProduct = leftScenarioData.products.find(p => p.id === "selectedEqChile")!;
                return eqProduct;
            }),
            filter(product => product.value || product.reference),
            switchMap(product => {
                return this.resolver.resolveReference(product)
            })
        ).subscribe(this.leftEqSelect$);
    }


    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "ChileShort" && step === "selectEqChile";
    }

    getInfo(state: RiesgosScenarioState, data: RiesgosProductResolved[], partition: PartitionName): WizardComposite {

        const step = state.steps.find(s => s.step.id === "selectEqChile")!;
        const inputProd = state.products.find(p => p.id === "userChoiceChile");
        if (!inputProd) return { hasFocus: false, inputs: [], step, layerControlables: [], oneLayerOnly: true };

        const outputProd = state.products.find(p => p.id === "selectedEqChile");

        function eqToLabel(eq: any) {
            const id = eq["properties"]["publicID"].replace("quakeml:quakeledger/", "");
            const mag = eq["properties"]["magnitude.mag.value"];
            const depth = eq["properties"]["origin.depth.value"];
            return `Mw ${mag}, ${depth} km (${id})`;
        }

        const options = Object.fromEntries(inputProd.options!.map(v => [eqToLabel(v), v]));
        if (partition === "right") {
            if (this.leftEqSelect$.value) {
                const leftEqSelected = this.leftEqSelect$.value.value;
                if (leftEqSelected.features && leftEqSelected.features[0] && leftEqSelected.features[0].properties) {
                    const key = eqToLabel(leftEqSelected.features[0]);
                    delete options[key];
                }
            }
        }

        return {
            hasFocus: false,
            oneLayerOnly: true,
            inputs: [{
                productId: 'userChoiceChile',
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
                                text: '0 km',
                                color: `rgb(${yellowRedRange(100, 0, 0).join(', ')})`,
                            }, {
                                text: '30 km',
                                color: `rgb(${yellowRedRange(100, 0, 30).join(', ')})`,
                            }, {
                                text: '60 km',
                                color: `rgb(${yellowRedRange(100, 0, 60).join(', ')})`,
                            }, {
                                text: '100 km',
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
                                label: 'Mw 6.0',
                                radius: linInterpolateXY(5, 5, 10, 20, 6.0),
                            }, {
                                label: 'Mw 7.0',
                                radius: linInterpolateXY(5, 5, 10, 20, 7.0),
                            }, {
                                label: 'Mw 8.0',
                                radius: linInterpolateXY(5, 5, 10, 20, 8.0),
                            }, {
                                label: 'Mw 9.0',
                                radius: linInterpolateXY(5, 5, 10, 20, 9.0),
                            }],
                            height: 100,
                            width: 100
                        }
                    }]
                }
            }),
            layerControlables: [],
        }    
    }
}