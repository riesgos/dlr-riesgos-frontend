import { Injectable } from "@angular/core";
import { Converter, LayerComposite } from "../../converter.service";
import { Observable, of } from "rxjs";
import { RiesgosProductResolved, RiesgosScenarioState, ScenarioName, StepStateTypes } from "src/app/state/state";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { linInterpolateXY, yellowRedRange } from "../../../../helpers/colorhelpers";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { FeatureLike } from "ol/Feature";

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
                            style: (feature: FeatureLike, resolution: number) => {
        
                                const props = feature.getProperties();
                                const magnitude = props['magnitude.mag.value'];
                                const depth = props['origin.depth.value'];
                
                                let radius = linInterpolateXY(5, 5, 10, 20, magnitude);
                                const [r, g, b] = yellowRedRange(100, 0, depth);
                
                                return new Style({
                                    image: new Circle({
                                        radius: radius,
                                        fill: new Fill({
                                            color: [r, g, b, 0.5]
                                        }),
                                        stroke: new Stroke({
                                            color: [r, g, b, 1]
                                        })
                                    }),
                                });
                            },
                    }),
                    popup: () => ({
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