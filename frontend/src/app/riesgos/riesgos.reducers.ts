import { createReducer, on } from '@ngrx/store';
import { initialRiesgosState } from './riesgos.state';
import * as RiesgosActions from './riesgos.actions';



export const reducer = createReducer(
    initialRiesgosState,

    on(RiesgosActions.metadataProvided, (state, action) => {
        return state
    }),

    on(RiesgosActions.scenarioChosen, (state, action) => {
        return state
    }),

    on(RiesgosActions.restartingScenario, (state, action) => {
        return state
    }),

    on(RiesgosActions.executeStart, (state, action) => {
        return state
    }),

    on(RiesgosActions.executeSuccess, (state, action) => {
        return state
    }),

    on(RiesgosActions.executeError, (state, action) => {
        return state
    }),

    on(RiesgosActions.userdataProvided, (state, action) => {
        return state
    })
);
