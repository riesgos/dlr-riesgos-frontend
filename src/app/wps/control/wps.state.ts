import { Process, Product, ProcessId } from './workflow_datatypes';
import { ProductId } from 'projects/services-wps/src/public_api';





export interface WpsState {
    processStates: Map<ProcessId, Process>, 
    productValues: Map<ProductId, Product>;
}