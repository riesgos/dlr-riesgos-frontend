import { ActionReducerMap } from '@ngrx/store';
import { WpsState } from './wps/control/wps.state';
import { wpsReducer } from './wps/control/wps.reducers';
import { WpsEffects } from './wps/control/wps.effects';

export interface State {
    wpsState: WpsState
}

export const reducers: ActionReducerMap<State> = {
    wpsState: wpsReducer
};

export const effects = [
    WpsEffects
];

