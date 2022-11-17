import { createReducer, on } from '@ngrx/store';
import * as InteractionActions from './interactions.actions';
import { initialInteractionState, InteractionState } from './interactions.state';


export const reducer = createReducer(
    initialInteractionState,

    on(InteractionActions.interactionStarted, (state, action) => {
        return {
            mode: action.mode,
            product: action.product
        };
    }),

    on(InteractionActions.interactionCompleted, (state, action) => {
        return {
            mode: 'normal',
            product: action.product
        };
    })
)
