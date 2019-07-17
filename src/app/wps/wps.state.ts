import { Process, Product, ProcessId } from './wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public_api';



export type Scenario = string;

export interface WpsState {
    scenario: Scenario;
    processStates: Process[], 
    productValues: Product[];
}


export const initialWpsState: WpsState = {
    scenario: "c1",
    processStates: [], 
    productValues: []
}