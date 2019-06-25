import { ActionReducerMap } from '@ngrx/store';
import { WpsState } from './wps/control/wps.state';
import { wpsReducer } from './wps/control/wps.reducers';
import { WpsEffects } from './wps/control/wps.effects';
import { FocusState } from './focus/focus.state';
import { focusReducer } from './focus/focus.reducers';

export interface State {
    wpsState: WpsState,
    focusState: FocusState
}

export const reducers: ActionReducerMap<State> = {
    wpsState: wpsReducer,
    focusState: focusReducer
};

export const effects = [
    WpsEffects
];

