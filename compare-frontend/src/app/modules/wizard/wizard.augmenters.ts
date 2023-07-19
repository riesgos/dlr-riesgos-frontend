import { ScenarioName, PartitionName } from "src/app/state/state";

export function findControlFactory(scenario: ScenarioName, partition: PartitionName, stepId: string): ControlFactory<any> | undefined {
    if (scenario === 'PeruShort') {
        if (stepId === 'selectEq') {
            return new UserChoiceControlConverter();
        }
    }
    console.warn(`Couln't find a ControlFactory for ${scenario}/${partition}/${stepId}`);
    return undefined;
}


export interface ControlFactory<T> {
    optionToKey(productId: string, option: T): string;
    keyToOption<T>(key: string, options: T[]): T;
}


class UserChoiceControlConverter implements ControlFactory<any> {
    optionToKey(productId: string, option: any): string {
        const props = option.properties;
        const mag = props["magnitude.mag.value"];
        const depth = props["origin.depth.value"];
        const id = props["publicID"].replace("quakeml:quakeledger/peru_", "");
        return `Mag. ${mag}, ${depth} km (${id})`;
    }
    keyToOption(key: string, options: any[]): any {
        const keyLength = key.length;
        const id = parseInt(key.slice(keyLength - 9, keyLength - 1));
        const pickedOption = options.find(o => {
            const props = o.properties;
            const oId = parseInt(props["publicID"].replace("quakeml:quakeledger/peru_", ""));
            return oId === id;
        });
        return pickedOption;
    }
}