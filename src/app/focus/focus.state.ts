import { ProcessId } from '../wps/wps.datatypes';






export interface FocusState {
    focussedProcessId: ProcessId | null;
}


export const initialFocusState: FocusState = {
    focussedProcessId: null
}