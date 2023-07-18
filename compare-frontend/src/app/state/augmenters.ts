import { Layer } from "ol/layer";
import { API_Datum, API_ScenarioState, API_Step } from "../services/backend.service";
import { LayerDescription, PartitionName, ScenarioName } from "./state";
import LayerRenderer from "ol/renderer/Layer";
import { Source } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { linInterpolateXY, yellowRedRange } from "../helpers/colorhelpers";
import { Circle, Fill, Stroke, Style } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";


export function getMapCenter(id: ScenarioName): number[] {
    return [-77.15, -12];
}

export function getMapZoom(id: ScenarioName): number {
    return 10;
}



export interface ControlFactory {
    optionToKey(productId: string, option: any): string;
}

export interface LayerDescriptionFactory {
    fromInfo(step: API_Step): LayerDescription[]
    fromProducts(newData: API_ScenarioState, oldLayers: LayerDescription[]): LayerDescription[]
}

export interface OlLayerFactory {
    toOlLayer(data: API_Datum, layerDescription: LayerDescription): Layer
}

export function findOlLayerFactory(scenario: ScenarioName, partition: PartitionName, layerId: string): OlLayerFactory | undefined {
    if (scenario === 'PeruShort') {
        if (layerId === 'userChoice') {
            return new UserChoiceOlLayerConverter();
        }
    }
    console.warn(`Couln't find an OlLayerFactory for ${scenario}/${partition}/${layerId}`);
    return undefined;
}

export function findControlFactory(scenario: ScenarioName, partition: PartitionName, stepId: string): ControlFactory | undefined {
    if (scenario === 'PeruShort') {
        if (stepId === 'selectEq') {
            return new UserChoiceControlConverter();
        }
    }
    console.warn(`Couln't find a ControlFactory for ${scenario}/${partition}/${stepId}`);
    return undefined;
}

export function findLayerDescriptionFactory(scenario: ScenarioName, partition: PartitionName, stepId: string): LayerDescriptionFactory | undefined {
    if (scenario === "PeruShort") {
        if (stepId === "selectEq") {
            return new UserChoiceLayerConverter();
        }
    }
    console.warn(`Couln't find a LayerDescriptionFactory for ${scenario}/${partition}/${stepId}`);
    return undefined;
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

class UserChoiceLayerConverter implements LayerDescriptionFactory {
    fromInfo(step: API_Step): LayerDescription[] {
        const input = step.inputs.find(i => i.id === "userChoice");
        if (!input) return [];
        return [{
            data: {
                id: input.id,
                value: {type: "FeatureCollection", features: input.options}
            },
            opacity: 0.8,
            type: 'vector',
            visible: true,
            layerCompositeId: input.id
        }];
    }
    fromProducts(newData: API_ScenarioState, oldLayers: LayerDescription[]): LayerDescription[] {
        return [];
    }

}


class UserChoiceControlConverter implements ControlFactory {
    optionToKey(productId: string, option: any): string {
        const props = option.properties;
        const mag = props["magnitude.mag.value"];
        const depth = props["origin.depth.value"];
        const id = props["publicID"].replace("quakeml:quakeledger/peru_", "");
        return `Mag. ${mag}, ${depth} km (${id})`;
    }

}