import { createSelector } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { WpsState } from './wps.state';

const getWpsState = (state: State) => {
    return state.wpsState;
}

export const getProcessStates = createSelector(
    getWpsState, 
    (s: WpsState) => s.processStates
);