import { API_ScenarioInfo, API_ScenarioState, API_Step, isApiDatum } from "../services/backend.service";
import { LayerDescription, PartitionName, ScenarioName } from "./state";



export function getMapCenter(id: ScenarioName): number[] {
    return [-77.6, -12.3];
}

export function getMapZoom(id: ScenarioName): number {
    return 9;
}

export interface LayerDescriptionFactory {
    fromProducts(apiSteps: API_ScenarioInfo, apiValues: API_ScenarioState, oldLayers: LayerDescription[]): LayerDescription[]
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

class UserChoiceLayerConverter implements LayerDescriptionFactory {

    fromProducts(apiSteps: API_ScenarioInfo, apiValues: API_ScenarioState, oldLayers: LayerDescription[]): LayerDescription[] {
        // @TODO: if product.id === "selectedEq" already there, display that instead.

        const step = apiSteps.steps.find(s => s.id === "selectEq");
        if (!step) return [];
        const options = step.inputs.find(i => i.id === "userChoice")?.options;
        if (!options) return [];
        const product = apiValues.data.find(d => d.id === "userChoice");

        const featureCollection = {type: "FeatureCollection", features: options};
        if (product && isApiDatum(product) && product.value) {
            const selectedId = product.value.properties["publicID"];
            for (const feature of featureCollection.features) {
                const featureId = feature.properties["publicID"];
                feature.properties["selected"] = featureId === selectedId;
            }
        }
        
        return [{
            layerId: "userChoice",
            data: {
                id: "userChoice",
                value: featureCollection
            },
            opacity: 0.8,
            type: 'vector',
            visible: true,
        }];
    }

}

