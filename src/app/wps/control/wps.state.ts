import { LifecyclePhase, ProcessId } from 'projects/workflowcontrol/src/public_api';




export interface ProcessState {
    processId: ProcessId, 
    processState: LifecyclePhase
}



export interface WpsState {
    processStates: ProcessState[]
}