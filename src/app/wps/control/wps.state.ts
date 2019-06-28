import { Process, Product, ProcessId } from './wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public_api';





export interface WpsState {
    processStates: Process[], 
    productValues: Product[];
}