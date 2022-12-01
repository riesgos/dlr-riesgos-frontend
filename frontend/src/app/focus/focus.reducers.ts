import { initialFocusState } from './focus.state';
import * as FocusActions from './focus.actions';
import { createReducer, on } from '@ngrx/store';


export const reducer = createReducer(
    initialFocusState,

    on(FocusActions.newProcessClicked, (state, action) => {
        return {
            ...state,
            focussedProcessId: action.processId
        }
    }),

    on(FocusActions.goToNextProcess, (state, action) => state)
);
