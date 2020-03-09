import { Product, ImmutableProcess } from './riesgos.datatypes';
import { Graph } from 'graphlib';


export type Scenario = string;

export interface RiesgosScenarioState {
    scenario: Scenario;
    processStates: ImmutableProcess[];
    productValues: Product[];
    graph: Graph;
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
