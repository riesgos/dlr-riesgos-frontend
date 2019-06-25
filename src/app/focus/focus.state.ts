import { Process, ProcessId } from '../wps/control/process';




export interface FocusState {
    focussedProcessId: ProcessId;
}


export const initialFocusState: FocusState = {
    focussedProcessId: "some initial focus"
}