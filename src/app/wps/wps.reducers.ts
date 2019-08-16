import { WpsActions, EWpsActionTypes, ProductsProvided, ScenarioChosen, RestartingFromProcess, WpsDataUpdate } from './wps.actions';
import { WpsState, initialWpsState } from './wps.state';



export function wpsReducer(state: WpsState = initialWpsState, action: WpsActions): WpsState  {
    switch (action.type) {

        case EWpsActionTypes.wpsDataUpdate:
            const newProcesses = (action as WpsDataUpdate).payload.processes;
            const newProducts = (action as WpsDataUpdate).payload.products;
            return {
                scenario: state.scenario,
                processStates: newProcesses,
                productValues: newProducts
            }

        case EWpsActionTypes.scenarioChosen:
            return {
                ... state,
                scenario: (action as ScenarioChosen).payload.scenario,
            };

        default:
            return state;
    }
}
