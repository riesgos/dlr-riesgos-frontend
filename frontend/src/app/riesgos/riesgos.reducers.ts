import { RiesgosActions, ERiesgosActionTypes, ProductsProvided, ScenarioChosen, RestartingFromProcess, RiesgosDataUpdate, MetadataProvided } from './riesgos.actions';
import { RiesgosState, initialRiesgosState } from './riesgos.state';



export function riesgosReducer(state: RiesgosState = initialRiesgosState, action: RiesgosActions): RiesgosState  {
    switch (action.type) {

        case ERiesgosActionTypes.metadataProvided:
            const newMetadata = (action as MetadataProvided).payload.metadata;
            return {
                ... state,
                metaData: newMetadata
            };

        case ERiesgosActionTypes.wpsDataUpdate:
            const newScenario = state.currentScenario;
            const newProcesses = (action as RiesgosDataUpdate).payload.processes;
            const newProducts = (action as RiesgosDataUpdate).payload.products;
            const newGraph = (action as RiesgosDataUpdate).payload.graph;
            const newState = {...state};
            newState.scenarioData[state.currentScenario] = {
                scenario: newScenario,
                processStates: newProcesses,
                productValues: newProducts,
                graph: newGraph
            };
            return newState;

        case ERiesgosActionTypes.scenarioChosen:
        case ERiesgosActionTypes.restartingScenario:
            return {
                ... state,
                currentScenario: (action as ScenarioChosen).payload.scenario,
            };

        default:
            return state;
    }
}
