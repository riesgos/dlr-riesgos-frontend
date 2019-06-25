import { ProcessId, ProcessState } from './workflowcontrol';
import { WpsData, ProductId } from 'projects/services-wps/src/public_api';





export interface WpsState {
    processStates: Map<ProcessId, ProcessState>,
    productValues: Map<ProductId, WpsData>
}