import { FocusAction, EFocusActionTypes } from './focus.actions';
import { FocusState, initialFocusState } from './focus.state';




export const focusReducer = function(state: FocusState = initialFocusState, action: FocusAction): FocusState {
    switch(action.type) {

        case EFocusActionTypes.newProcessClicked:
            return {
                ...state, 
                focussedProcessId: action.payload.processId
            }

        default: 
            return state;

    }
}