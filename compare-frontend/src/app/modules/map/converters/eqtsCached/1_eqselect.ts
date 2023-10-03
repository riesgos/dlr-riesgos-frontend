import { Injectable } from "@angular/core";
import { Converter, LayerComposite } from "../../converter.service";
import { BehaviorSubject, Observable, filter, map, of, partition, switchMap } from "rxjs";
import { PartitionName, RiesgosProductResolved, RiesgosScenarioState, RiesgosState, ScenarioName, StepStateTypes } from "src/app/state/state";
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
import { TranslationService } from "src/app/services/translation.service";
import { ResolverService } from "src/app/services/resolver.service";

@Injectable()
export class CachedEqSelection implements Converter {
    
    private riesgosState$ = new BehaviorSubject<RiesgosState | undefined>(undefined);
    private leftEqSelect$ = new BehaviorSubject<RiesgosProductResolved | undefined>(undefined);

    constructor(
        private store: Store<{ riesgos: RiesgosState }>,
        private translate: TranslationService,
        private resolver: ResolverService
    ) {
        store.select(state => state.riesgos).subscribe(this.riesgosState$);
        this.riesgosState$.pipe(
            filter(state => !!state),
            map(state => {
                const leftScenarioData = state!.scenarioData.PeruCached!.left!;
                const eqProduct = leftScenarioData.products.find(p => p.id === "selectedEq")!;
                return eqProduct;
            }),
            filter(product => product.value || product.reference),
            switchMap(product => {
                return this.resolver.resolveReference(product)
            })
        ).subscribe(this.leftEqSelect$);
    }

    applies(scenario: ScenarioName, step: string): boolean {
        return scenario === "PeruCached" && step === "selectEq";
    }

    makeLayers(state: RiesgosScenarioState, data: RiesgosProductResolved[], partition: PartitionName): Observable<LayerComposite[]> {
        const prnt = this;
        const layers: LayerComposite[] = [];
        const stepState = state.steps.find(s => s.step.id === "selectEq")?.state.type;


        if (stepState === StepStateTypes.available) {
            const availableEqs = state.products.find(p => p.id === "userChoice");

            const _store = this.store;
            const _trslt = this.translate;

            if (availableEqs) {
                let availableEqOptions = structuredClone(availableEqs.options);
                const pickedEqId = availableEqs.value?.properties["publicID"];
                if (availableEqOptions) {
                    for (const option of availableEqOptions) {
                        if (option.properties["publicID"] === pickedEqId) {
                            option.properties["selected"] = true;
                        } else {
                            option.properties["selected"] = false;
                        }
                    }
                }

                if (partition === "right") {
                    const leftValue = this.leftEqSelect$.value;
                    if (leftValue && leftValue.value && leftValue.value.features && leftValue.value.features[0]) {
                        const pickedIdLeft = leftValue.value.features[0].id;
                        availableEqOptions = availableEqOptions?.filter((o: any) => o.id !== pickedIdLeft);
                    }
                }

                const layer = new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures({ type: "FeatureCollection", features: availableEqOptions })
                    }),
                    style: (feature: FeatureLike, resolution: number) => {
                        const props = feature.getProperties();
                        const magnitude = props['magnitude.mag.value'];
                        const depth = props['origin.depth.value'];
                        const selected = props['selected'];
            
                        let radius = linInterpolateXY(5, 5, 10, 20, magnitude);
                        const [r, g, b] = yellowRedRange(100, 0, depth);
                        const alpha = selected ? 0.8 : 0.5;
            
                        return new Style({
                            image: new Circle({
                                radius: radius,
                                fill: new Fill({
                                    color: [r, g, b, alpha]
                                }),
                                stroke: new Stroke({
                                    color: [r, g, b, 1],
                                    width: selected ? 2 : 1
                                })
                            }),
                        });
                    }
                });


                layers.push({
                    id: "userChoiceLayer",
                    stepId: "selectEq",
                    layer: layer,
                    popup: (location, features) => {
                        if (features.length === 0) return undefined;
                        const props = features[0].getProperties();
                        const tableFields: any = {};
                        tableFields[_trslt.translate("Magnitude")] = "Mw " + props["magnitude.mag.value"];
                        tableFields[_trslt.translate("Depth")] = props["origin.depth.value"] + " km";
                        const popupBody = createKeyValueTableHtml(tableFields, "medium");
                        return {
                            component: StringPopupComponent,
                            args: {
                              "title": "Earthquake",
                              "subTitle": "",
                              "body": popupBody
                            }  
                        };
                    },
                    onClick(location: number[], features: Feature[]) {
                        if (features.length === 0) {
                            return;
                        }

                        const olFeature = features[0];

                        const converter = new GeoJSON();
                        const feature = JSON.parse(converter.writeFeature(olFeature));
                        _store.dispatch(stepConfig({ partition: state.partition, scenario: state.scenario, stepId: "selectEq", values: { userChoice: feature } }));
                    },
                    onHover() {},
                    opacity: 1.0,
                    visible: true,
                });
            }
        }

        if (stepState === StepStateTypes.completed) {
            const selectedEq = data.find(d => d.id === "selectedEq");
            const _trslt = this.translate;

            if (selectedEq) {
                layers.push({
                    id: "selectedEqLayer",
                    stepId: "selectEq",
                    layer: new VectorLayer({
                        source: new VectorSource({
                            features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(selectedEq.value)
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
                        }
                    }),
                    popup: (location, features) => {
                        if (features.length === 0) return undefined;
                        const props = features[0].getProperties();
                        const tableFields: any = {};
                        tableFields[_trslt.translate("Magnitude")] = "Mw " + props["magnitude.mag.value"];
                        tableFields[_trslt.translate("Depth")] = props["origin.depth.value"] + " km";
                        const popupBody = createKeyValueTableHtml(tableFields, "medium");
                        return {
                            component: StringPopupComponent,
                            args: {
                                "title": "ChosenEq",
                                "subTitle": "",
                                "body": popupBody
                            }   
                        }
                    },
                    onClick: () => {},
                    onHover: () => {},
                    opacity: 1.0,
                    visible: true
                });
            }
        }

        return of(layers);
    }

}