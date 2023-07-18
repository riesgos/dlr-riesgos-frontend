import { API_ScenarioState, API_Step } from "../services/backend.service";
import { LayerDescription, PartitionName, ScenarioName } from "./state";


export function getMapCenter(id: ScenarioName): number[] {
    return [-77.15, -12];
}

export function getMapZoom(id: ScenarioName): number {
    return 10;
}



export interface ControlConverter {
    optionToKey(productId: string, option: any): string;
}

export interface LayerConverter {
    fromInfo(step: API_Step): LayerDescription[];
    fromProducts(newData: API_ScenarioState, oldLayers: LayerDescription[]): LayerDescription[]
}

export function findControlConverter(scenario: ScenarioName, partition: PartitionName, stepId: string): ControlConverter | undefined {
    if (scenario === 'PeruShort') {
        if (stepId === 'selectEq') {
            return new UserChoiceControlConverter();
        }
    }
    return undefined;
}

export function findLayerConverter(scenario: ScenarioName, partition: PartitionName, stepId: string): LayerConverter | undefined {
    if (scenario === "PeruShort") {
        if (stepId === "selectEq") {
            return new UserChoiceLayerConverter();
        }
    }
    return undefined;
}







class UserChoiceLayerConverter implements LayerConverter {
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


class UserChoiceControlConverter implements ControlConverter {
    optionToKey(productId: string, option: any): string {
        const props = option.properties;
        const mag = props["magnitude.mag.value"];
        const depth = props["origin.depth.value"];
        const id = props["publicID"].replace("quakeml:quakeledger/peru_", "");
        return `Mag. ${mag}, ${depth} km (${id})`;
    }

}