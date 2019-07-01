import { ActionReducerMap } from '@ngrx/store';
import { WpsState } from './wps/wps.state';
import { wpsReducer } from './wps/wps.reducers';
import { WpsEffects } from './wps/wps.effects';
import { FocusState } from './focus/focus.state';
import { focusReducer } from './focus/focus.reducers';
import { InteractionState } from './interactions/interactions.state';
import { interactionReducer } from './interactions/interactions.reducer';
import { InteractionEffects } from './interactions/interactions.effects';

export interface State {
    wpsState: WpsState,
    focusState: FocusState,
    interactionState: InteractionState
}

export const reducers: ActionReducerMap<State> = {
    wpsState: wpsReducer,
    focusState: focusReducer,
    interactionState: interactionReducer
};

export const effects = [
    WpsEffects, InteractionEffects
];

