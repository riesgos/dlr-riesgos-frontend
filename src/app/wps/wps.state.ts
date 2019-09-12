import { Process, Product, ProcessId } from './wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public-api';
import { Graph, alg } from 'graphlib';


export type Scenario = string;

export interface WpsScenarioState {
    scenario: Scenario;
    processStates: Process[];
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
    currentScenario: 'c1',
    scenarioData: {}
};
