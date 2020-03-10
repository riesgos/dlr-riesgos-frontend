import { Product, ImmutableProcess } from './riesgos.datatypes';
import { Graph } from 'graphlib';


export type Scenario = string;

export interface RiesgosScenarioState {
    scenario: Scenario;
    processStates: ImmutableProcess[];
    productValues: Product[];
    graph: Graph;
}


export function isRiesgosScenarioState(obj: object): obj is RiesgosScenarioState {
    return  obj.hasOwnProperty('scenario') &&
            obj.hasOwnProperty('processStates') &&
            obj.hasOwnProperty('productValues') &&
            obj.hasOwnProperty('graph');
}


export interface RiesgosScenarioMetadata {
    id: string;
    title: string;
    description: string;
    preview: string;
}


export interface RiesgosState {
    currentScenario: Scenario;
    scenarioData: {
        [key in Scenario]: RiesgosScenarioState
    };
    metaData: RiesgosScenarioMetadata[];
}


export const initialRiesgosState: RiesgosState = {
    currentScenario: 'none',
    scenarioData: {
        'none': {
            scenario: 'none',
            graph: new Graph(),
            processStates: [],
            productValues: []
        }
    },
    metaData: []
};
