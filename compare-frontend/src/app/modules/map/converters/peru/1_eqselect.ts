import { Injectable } from "@angular/core";
import { Converter, MapLayer } from "../../converter.service";
import { Observable, of } from "rxjs";
import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName, StepStateTypes } from "src/app/state/state";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

@Injectable()
export class EqSelection implements Converter {

    applies(scenario: ScenarioName, step: string): boolean {
        return step === "selectEq";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<MapLayer[]> {
        const layers: MapLayer[] = [];

        const step = state.focus.focusedStep;
        const stepState = state.steps.find(s => s.step.id === step)?.state.type;

        if (stepState === StepStateTypes.available) {
            const availableEqs = state.products.find(p => p.id === "userChoice");

            if (availableEqs) {
                layers.push({
                    layer: new VectorLayer({
                            source: new VectorSource({
                                features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures({ type: "FeatureCollection", features: availableEqs.options })
                            }),
                        }),
                    // info: {},
                    // legend: {},
                    // popup: {},
                    onClick: () => {},
                    onHover: () => {},
                    visible: true
                });
            }
        }

        if (stepState === StepStateTypes.completed) {
            const selectedEq = data.find(d => d.id === "selectedEq");

            if (selectedEq) {
                layers.push({
                    layer: new VectorLayer({
                            source: new VectorSource({
                                features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(selectedEq.value)
                            }),
                        }),
                    // info: {},
                    // legend: {},
                    // popup: {},
                    onClick: () => {},
                    onHover: () => {},
                    visible: true
                });
            }
        }

        return of(layers);
    }

}