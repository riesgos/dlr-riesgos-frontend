import { createSelector } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { WpsState } from './wps.state';

const getWpsState = (state: State) => state.wpsState;

export const getStateForProcess = createSelector(
    getWpsState, 
    (wpsState: WpsState, args) => {
        return wpsState.processStates.get(args.id);
    }
)


export const getProcesses = createSelector(
    getWpsState, 
    (wpsState: WpsState) => wpsState.processes
);
