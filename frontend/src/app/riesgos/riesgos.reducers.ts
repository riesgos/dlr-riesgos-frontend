import { createReducer, on } from '@ngrx/store';
import { initialRiesgosState } from './riesgos.state';
import * as RiesgosActions from './riesgos.actions';



export const reducer = createReducer(
    initialRiesgosState,

    on(RiesgosActions.scenariosLoaded, (state, action) => {
        return {
            ... state,
            metaData: action.scenarios
        }
    }),

    on(RiesgosActions.scenarioChosen, (state, action) => {
        return {
            ... state,
            activeScenario: action.scenario
        }
    }),

    on(RiesgosActions.restartingScenario, (state, action) => {
        // @TODO: remove scenario's data
        return {
            ...state,
            currentScenario: action.scenario
        }
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

    on(RiesgosActions.userDataProvided, (state, action) => {
        return state
    })
);
