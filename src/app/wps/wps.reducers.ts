import { WpsActions, EWpsActionTypes, ProductsProvided, ScenarioChosen, RestartingFromProcess, WpsDataUpdate } from './wps.actions';
import { WpsState, initialWpsState } from './wps.state';



export function wpsReducer(state: WpsState = initialWpsState, action: WpsActions): WpsState  {
    switch (action.type) {

        case EWpsActionTypes.wpsDataUpdate:
            const newScenario = state.currentScenario;
            const newProcesses = (action as WpsDataUpdate).payload.processes;
            const newProducts = (action as WpsDataUpdate).payload.products;
            const newGraph = (action as WpsDataUpdate).payload.graph;
            const newState = {...state};
            newState.scenarioData[state.currentScenario] = {
                scenario: newScenario,
                processStates: newProcesses,
                productValues: newProducts,
                graph: newGraph
            };
            return newState;

        case EWpsActionTypes.scenarioChosen:
            return {
                ... state,
                currentScenario: (action as ScenarioChosen).payload.scenario,
            };

        default:
            return state;
    }
}
