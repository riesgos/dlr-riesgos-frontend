import { ActionReducerMap } from '@ngrx/store';
import { RiesgosState } from './riesgos/riesgos.state';
import { reducer as riesgosReducer } from './riesgos/riesgos.reducers';
import { RiesgosEffects } from './riesgos/riesgos.effects';
import { FocusState } from './focus/focus.state';
import { reducer as focusReducer } from './focus/focus.reducers';
import { InteractionState } from './interactions/interactions.state';
import { interactionReducer } from './interactions/interactions.reducer';
import { InteractionEffects } from './interactions/interactions.effects';

export interface State {
    riesgosState: RiesgosState;
    focusState: FocusState;
    interactionState: InteractionState;
}

export const reducers: ActionReducerMap<State> = {
    riesgosState: riesgosReducer,
    focusState: focusReducer,
    interactionState: interactionReducer
};

export const effects = [
    RiesgosEffects, InteractionEffects
];

