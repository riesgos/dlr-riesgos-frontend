import { Injectable } from "@angular/core";
import { Converter, LayerComposite } from "../../converter.service";
import { Observable, of } from "rxjs";
import { ScenarioName, RiesgosScenarioState, RiesgosProductResolved, StepStateCompleted, StepStateTypes } from "src/app/state/state";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";



@Injectable()
export class EqSimulation implements Converter {
    applies(scenario: ScenarioName, step: string): boolean {
        return step === "EqSimulation";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const step = state.steps.find(s => s.step.id === "EqSimulation");
        if (!step) return of([]);

        if (step.state.type === StepStateTypes.completed) {
            const product = data.find(d => d.id === "eqSimWms");
            if (!product) return of([]);

            const fullUrl = new URL(product.value);
            const baseUrl = fullUrl.origin + fullUrl.pathname;
            const layers = fullUrl.searchParams.get("layers");

            return of([
                {
                    id: "eqSimWmsLayer",
                    layer: new TileLayer({
                        source: new TileWMS({
                            url: baseUrl,
                            params: {
                                "LAYERS": layers,
                                "STYLES": "shakemap-pga"
                            }
                        }),
                        opacity: 0.4
                    }),
                    popup: (location: number[]) => ({
                        component: StringPopupComponent,
                        args: {}  
                    }),
                    onClick: () => {},
                    onHover: () => {},
                    opacity: 1.0
                }
            ]);


        } else {
            return of([]);
        }
    }
    
}
