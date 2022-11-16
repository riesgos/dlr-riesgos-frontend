import { createReducer, on } from '@ngrx/store';
import { initialRiesgosState } from './riesgos.state';
import * as RiesgosActions from './riesgos.actions';



export const reducer = createReducer(
    initialRiesgosState,

    on(RiesgosActions.metadataProvided, (state, action) => {
        const newMetadata = action.metadata;
        return {
            ... state,
            metaData: newMetadata
        };
    }),

    on(RiesgosActions.riesgosDataUpdate, (state, action) => {
        const newScenario = state.currentScenario;
        const newProcesses = action.processes;
        const newProducts = action.products;
        const newGraph = action.graph;
        const newState = {...state};
        newState.scenarioData[state.currentScenario] = {
            scenario: newScenario,
            processStates: newProcesses,
            productValues: newProducts,
            graph: newGraph
        };
        return newState;
    }),

    on(RiesgosActions.scenarioChosen, (state, action) => {
        return {
            ... state,
            currentScenario: action.scenario,
        };
    }),

    on(RiesgosActions.restartingScenario, (state, action) => {
        return {
            ... state,
            currentScenario: action.scenario,
        };
    })
);
