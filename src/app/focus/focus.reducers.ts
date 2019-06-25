import { FocusAction, EFocusActionTypes } from './focus.actions';
import { FocusState } from './focus.state';




export const focusReducer = function(state: FocusState, action: FocusAction): FocusState {
    switch(action.type) {

        case EFocusActionTypes.newProcessClicked:
            return {
                ...state, 
                focussedProcess: action.payload.process
            }

        default: 
            return state;

    }
}