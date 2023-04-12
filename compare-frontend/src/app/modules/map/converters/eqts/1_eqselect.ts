import { Injectable } from "@angular/core";
import { Converter, LayerComposite } from "../../converter.service";
import { Observable, of } from "rxjs";
import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName, StepStateTypes } from "src/app/state/state";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import Layer from "ol/layer/Layer";

@Injectable()
export class EqSelection implements Converter {

    applies(scenario: ScenarioName, step: string): boolean {
        return step === "selectEq";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const layers: LayerComposite[] = [];
        const step = state.focus.focusedStep;
        const stepState = state.steps.find(s => s.step.id === step)?.state.type;

        if (stepState === StepStateTypes.available) {
            const availableEqs = state.products.find(p => p.id === "userChoice");

            if (availableEqs) {
                layers.push({
                    id: "userChoiceLayer",
                    layer: new VectorLayer({
                            source: new VectorSource({
                                features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures({ type: "FeatureCollection", features: availableEqs.options })
                            }),
                    }),
                    // info: {},
                    // legend: {},
                    popup: (location: number[]) => ({
                      component: StringPopupComponent,
                      args: {
                        "title": "title",
                        "subTitle": "subTitle",
                        "body": "body"
                      }  
                    }),
                    onClick() {},
                    onHover() {},
                    visible: true
                });
            }
        }

        if (stepState === StepStateTypes.completed) {
            const selectedEq = data.find(d => d.id === "selectedEq");

            if (selectedEq) {
                layers.push({
                    id: "selectedEqLayer",
                    layer: new VectorLayer({
                            source: new VectorSource({
                                features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(selectedEq.value)
                            }),
                        }),
                    // info: {},
                    // legend: {},
                    popup: (location: number[]) => ({
                        component: StringPopupComponent,
                        args: {}  
                      }),
                    onClick: () => {},
                    onHover: () => {},
                    visible: true
                });
            }
        }

        return of(layers);
    }

}