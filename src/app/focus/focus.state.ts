import { ProcessId } from '../wps/control/workflow_datatypes';






export interface FocusState {
    focussedProcessId: ProcessId;
}


export const initialFocusState: FocusState = {
    focussedProcessId: "some initial focus"
}