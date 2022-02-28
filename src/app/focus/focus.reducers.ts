import { FocusAction, EFocusActionTypes, NewProcessClicked } from './focus.actions';
import { FocusState, initialFocusState } from './focus.state';




export function focusReducer(state: FocusState = initialFocusState, action: FocusAction): FocusState {
    switch (action.type) {

        case EFocusActionTypes.newProcessClicked:
            return {
                ...state,
                focussedProcessId: (action as NewProcessClicked).payload.processId
            };


        case EFocusActionTypes.goToNextProcess:
        default:
            return state;

    }
}
