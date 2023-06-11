import { Injectable } from "@angular/core";
import { Converter, LayerComposite } from "../../converter.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { RiesgosProductResolved, RiesgosScenarioState, RiesgosState, Rules, ScenarioName, StepStateTypes } from "src/app/state/state";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { StringPopupComponent } from "../../popups/string-popup/string-popup.component";
import { linInterpolateXY, yellowRedRange } from "../../../../helpers/colorhelpers";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Feature, { FeatureLike } from "ol/Feature";
import { Store } from "@ngrx/store";
import { stepConfig } from "src/app/state/actions";
import { createKeyValueTableHtml } from "src/app/helpers/others";

@Injectable()
export class EqSelection implements Converter {

    private selectedFeature: Feature | undefined;
    
    constructor(private store: Store<{ riesgos: RiesgosState }>) {}

    applies(scenario: ScenarioName, step: string): boolean {
        return step === "selectEq";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[]): Observable<LayerComposite[]> {
        const prnt = this;
        const layers: LayerComposite[] = [];
        const stepState = state.steps.find(s => s.step.id === "selectEq")?.state.type;


        const defaultStyle = (feature: FeatureLike, resolution: number) => {
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
        }

        const selectedStyle = (feature: FeatureLike, resolution: number) => {
            const oldStyle = defaultStyle(feature, resolution).getImage() as Circle;
            const newStyle = new Style({
                image: new Circle({
                    radius: oldStyle.getRadius() + 5,
                    fill: oldStyle.getFill(),
                    stroke: oldStyle.getStroke()
                })
            })
            return newStyle;
        }

        if (stepState === StepStateTypes.available) {
            const availableEqs = state.products.find(p => p.id === "userChoice");
            const _store = this.store;

            if (availableEqs) {

                const layer = new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures({ type: "FeatureCollection", features: availableEqs.options })
                    }),
                    style: defaultStyle
                });

                if (this.selectedFeature !== undefined) {
                    layer.getSource()?.forEachFeature(f => {
                        if (f.getId() === this.selectedFeature?.getId()) {
                            f.setStyle(selectedStyle(f, 0));
                        }
                    });
                }

                layers.push({
                    id: "userChoiceLayer",
                    layer: layer,
                    popup: (location, features) => {
                        if (features.length === 0) return undefined;
                        const props = features[0].getProperties();
                        return {
                            component: StringPopupComponent,
                            args: {
                              "title": "AvailableEqs",
                              "subTitle": "",
                              "body": createKeyValueTableHtml({
                                "Depth": props["origin.depth.value"],
                                "Magnitude": props["magnitude.mag.value"]
                              }, "medium")
                            }  
                        };
                    },
                    onClick(location: number[], features: Feature[]) {
                        if (features.length === 0) {
                            prnt.selectedFeature = undefined;
                            return;
                        }

                        const olFeature = features[0];
                        prnt.selectedFeature = olFeature;

                        const converter = new GeoJSON();
                        const feature = JSON.parse(converter.writeFeature(olFeature));
                        _store.dispatch(stepConfig({ partition: state.partition, scenario: state.scenario, stepId: "selectEq", values: { userChoice: feature } }));
                    },
                    onHover() {},
                    opacity: 1.0
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
                        style: defaultStyle
                    }),
                    popup: (location, features) => {
                        if (features.length === 0) return undefined;
                        const props = features[0].getProperties();
                        return {
                            component: StringPopupComponent,
                            args: {
                                "title": "ChosenEq",
                                "subTitle": "",
                                "body": createKeyValueTableHtml({
                                    "Depth": props["origin.depth.value"],
                                    "Magnitude": props["magnitude.mag.value"]
                                }, "medium")
                            }   
                        }
                    },
                    onClick: () => {},
                    onHover: () => {},
                    opacity: 1.0
                });
            }
        }

        return of(layers);
    }

}