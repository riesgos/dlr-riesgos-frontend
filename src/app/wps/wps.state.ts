import { Product, ImmutableProcess } from './wps.datatypes';
import { Graph } from 'graphlib';


export type Scenario = string;

export interface WpsScenarioState {
    scenario: Scenario;
    processStates: ImmutableProcess[];
    productValues: Product[];
    graph: Graph;
}

export interface WpsState {
    currentScenario: Scenario;
    scenarioData: {
        [key in Scenario]: WpsScenarioState
    };
}


export const initialWpsState: WpsState = {
    currentScenario: 'none',
    scenarioData: {
        'none': {
            scenario: 'none',
            graph: new Graph(),
            processStates: [],
            productValues: []
        }
    }
};
