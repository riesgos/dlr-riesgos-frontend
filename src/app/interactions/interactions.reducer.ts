import { InteractionActionTypes, InteractionAction, InteractionStarted, InteractionCompleted } from './interactions.actions';
import { initialInteractionState, InteractionState } from './interactions.state';




export const interactionReducer = (state: InteractionState = initialInteractionState, action: InteractionAction): InteractionState => {
    switch(action.type) {

        case InteractionActionTypes.started: 
            return {
                mode: (action as InteractionStarted).payload.mode, 
                product: (action as InteractionStarted).payload.product
            };

        case InteractionActionTypes.completed: 
            return {
                mode: "normal", 
                product: (action as InteractionCompleted).payload.product
            };

        default: 
            return state;

    }
}