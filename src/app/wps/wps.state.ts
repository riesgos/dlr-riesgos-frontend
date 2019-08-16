import { Process, Product, ProcessId } from './wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public-api';
import { Graph, alg } from 'graphlib';


export type Scenario = string;

export interface WpsState {
    scenario: Scenario;
    processStates: Process[];
    productValues: Product[];
    graph: Graph;
}


export const initialWpsState: WpsState = {
    scenario: 'c1',
    processStates: [],
    productValues: [],
    graph: null
}