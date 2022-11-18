import { StepId } from '../riesgos/riesgos.datatypes';






export interface FocusState {
    focussedProcessId: StepId | null;
}


export const initialFocusState: FocusState = {
    focussedProcessId: null
}