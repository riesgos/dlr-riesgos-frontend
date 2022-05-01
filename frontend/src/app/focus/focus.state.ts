import { ProcessId } from '../riesgos/riesgos.datatypes';






export interface FocusState {
    focussedProcessId: ProcessId | null;
}


export const initialFocusState: FocusState = {
    focussedProcessId: null
}