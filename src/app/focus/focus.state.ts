import { ProcessId } from '../wps/control/wps.datatypes';






export interface FocusState {
    focussedProcessId: ProcessId;
}


export const initialFocusState: FocusState = {
    focussedProcessId: "some initial focus"
}