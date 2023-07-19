import { Action } from "@ngrx/store";
import { Feature } from "ol";
import { FeatureLike } from "ol/Feature";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import LayerRenderer from "ol/renderer/Layer";
import { Source, TileWMS } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Style, Fill, Stroke, Circle } from "ol/style";
import { linInterpolateXY, yellowRedRange } from "src/app/helpers/colorhelpers";
import { isApiDatumReference, API_Datum } from "src/app/services/backend.service";
import { ScenarioName, PartitionName, LayerDescription } from "src/app/state/state";
import * as AppActions from "src/app/state/actions";
import GeoJSON from "ol/format/GeoJSON";
import { Type } from "@angular/core";
import { createKeyValueTableHtml } from "src/app/helpers/others";
import { StringPopupComponent } from "./popups/string-popup/string-popup.component";
import TileLayer from "ol/layer/Tile";


export interface OlLayerFactory {
    toOlLayer(data: API_Datum, layerDescription: LayerDescription): Layer
}

export interface ClickHandler {
    handleClick(scenario: ScenarioName, partition: PartitionName, layer: LayerDescription, feature: FeatureLike): Action[]
}

export interface PopupHandler {
    createPopup(scenario: ScenarioName, partition: PartitionName, layer: LayerDescription, feature: FeatureLike): {component: Type<any>, args: {[key: string]: any}};
}


export function findPopupHandler(scenario: ScenarioName, partition: PartitionName, location: number[], layerId: string, feature: FeatureLike): PopupHandler | undefined {
    if (scenario === "PeruShort") {
        if (layerId === "userChoice") {
            return new UserChoicePopupHandler();
        }
    }
    return undefined;
}


export function findClickHandler(scenario: ScenarioName, partition: PartitionName, location: number[], layerId: string, feature: FeatureLike): ClickHandler | undefined {
    if (scenario === "PeruShort") {
        if (layerId === "userChoice") {
            return new UserChoiceClickHandler();
        }
    }
    return undefined;
}


export function findOlLayerFactory(scenario: ScenarioName, partition: PartitionName, layerId: string): OlLayerFactory | undefined {
    if (scenario === 'PeruShort') {
        if (layerId === 'userChoice') {
            return new UserChoiceOlLayerConverter();
        }
    }
    return new DefaultLayerFactory();
}

class UserChoiceClickHandler implements ClickHandler {
    handleClick(scenario: ScenarioName, partition: PartitionName, layer: LayerDescription, clickedFeature: FeatureLike): Action[] {
        const newLayer = structuredClone(layer);
        if (isApiDatumReference(newLayer.data)) return [];
        const clickedFeatureId = clickedFeature.getProperties()["publicID"];
        let clickedFeatureJson = JSON.parse(new GeoJSON().writeFeature(clickedFeature as Feature));
        for (const feature of newLayer.data.value.features) {
            const featureId = feature.properties.publicID;
            if (featureId === clickedFeatureId) {
                feature.properties["selected"] = true;
            } else {
                feature.properties["selected"] = false;
            }
        }
        return [
            AppActions.stepConfig({ scenario, partition, stepId: "selectEq",  values: { userChoice: clickedFeatureJson } })
        ]
    }

}

class UserChoiceOlLayerConverter implements OlLayerFactory {
    toOlLayer(data: API_Datum, layerDescription: LayerDescription): Layer<Source, LayerRenderer<any>> {
        return new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(data.value)
            }),
            style: (feature) => {
                const props = feature.getProperties();
                const magnitude = props['magnitude.mag.value'];
                const depth = props['origin.depth.value'];
                const selected = props['selected'];

                let radius = linInterpolateXY(5, 5, 10, 20, magnitude);
                const [r, g, b] = yellowRedRange(100, 0, depth);
                const alpha = selected ? 1.0 : 0.5;

                return new Style({
                    image: new Circle({
                        radius: radius,
                        fill: new Fill({
                            color: [r, g, b, alpha]
                        }),
                        stroke: new Stroke({
                            color: [r, g, b, 1]
                        })
                    }),
                });
            }
        })
    }
}

class UserChoicePopupHandler implements PopupHandler {
    createPopup(scenario: ScenarioName, partition: PartitionName, layer: LayerDescription, feature: FeatureLike): { component: Type<any>; args: { [key: string]: any; }; } {
        const props = feature.getProperties();
        const tableFields: any = {};
        // tableFields[_trslt.translate("Magnitude")] = props["magnitude.mag.value"];
        // tableFields[_trslt.translate("Depth")] = props["origin.depth.value"] + " km";
        tableFields["Magnitude"] = props["magnitude.mag.value"];
        tableFields["Depth"] = props["origin.depth.value"] + " km";
        const popupBody = createKeyValueTableHtml(tableFields, "medium");
        return {
            component: StringPopupComponent,
            args: {
                "title": "AvailableEqs",
                "subTitle": "",
                "body": popupBody
            }  
        };
    }
}

class DefaultLayerFactory implements OlLayerFactory {
    toOlLayer(data: API_Datum, layerDescription: LayerDescription): Layer<Source, LayerRenderer<any>> {
        if (layerDescription.type === 'raster') {
            const url = data.value;
            return new TileLayer({
                source: new TileWMS({
                    url: url,
                    params: {}
                })
            });
        } else {
            const features = data.value;
            return new VectorLayer({
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(features)
                })
            });
        }
    }

}