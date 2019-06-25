import { createSelector } from '@ngrx/store';
import { FocusState } from './focus.state';
import { State } from '../ngrx_register';


const getFocusState = function(state: State): FocusState {
    return state.focusState;
}


export const getFocussedProcess = createSelector(
    getFocusState, 
    (focusState: FocusState) => focusState.focussedProcess
);