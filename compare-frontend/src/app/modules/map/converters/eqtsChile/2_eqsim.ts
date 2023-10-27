import { Injectable } from "@angular/core";
import { Converter, LayerComposite } from "../../converter.service";
import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved, StepStateCompleted, StepStateTypes } from "src/app/state/state";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { FeatureLike } from "ol/Feature";
import { createTableHtml } from "src/app/helpers/others";
import { toDecimalPlaces } from "src/app/helpers/colorhelpers";



@Injectable()
export class EqSimulationChile implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "ChileShort" &&  step === "EqSimulationChile";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const step = state.steps.find(s => s.step.id === "EqSimulationChile");
        if (!step) return of([]);

        if (step.state.type === StepStateTypes.completed) {
            const product = data.find(d => d.id === "eqSimWmsChile");
            if (!product) return of([]);

            const fullUrl = new URL(product.value);
            const baseUrl = fullUrl.origin + fullUrl.pathname;
            const layers = fullUrl.searchParams.get("layers");

            return of([
                {
                    id: "eqSimWmsLayer",
                    stepId: "EqSimulationChile",
                    layer: new TileLayer({
                        source: new TileWMS({
                            url: baseUrl,
                            params: {
                                "LAYERS": layers,
                                "STYLES": "shakemap-pga"
                            }
                        }),
                        opacity: 0.4,
                        visible: true
                    }),
                    popup: (location: number[], features: FeatureLike[]) => {
                        const props = features[0].getProperties();
                        const entry = `${toDecimalPlaces(props['GRAY_INDEX'], 2)} g`;
                        return {
                            component: StringPopupComponent,
                            args: {
                                title: `Ground_acceleration_PGA`,
                                body: createTableHtml([[entry]])
                            }  
                        };
                    },
                    onClick: () => {},
                    onHover: () => {},
                    opacity: 1.0,
                    visible: true
                }
            ]);


        } else {
            return of([]);
        }
    }
    
}
