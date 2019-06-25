import { Process, Product, ProcessId, ProcessState } from './process';
import { ProductId } from 'projects/services-wps/src/public_api';




export interface WpsState {
    processStates: Map<ProcessId, ProcessState>, 
    productValues: Map<ProductId, Product>
}


export const initialWpsState: WpsState = {
    processStates: new Map<ProcessId, ProcessState>(), 
    productValues: new Map<ProductId, Product>()
}