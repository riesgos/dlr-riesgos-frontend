import { createReducer, on } from '@ngrx/store';
import { initialRiesgosState, RiesgosProduct, RiesgosScenarioState, StepStateCompleted, StepStateError, StepStateRunning } from './riesgos.state';
import * as RiesgosActions from './riesgos.actions';
import { isApiDatum, isApiDatumReference } from '../services/backend/backend.service';



export const reducer = createReducer(
    initialRiesgosState,

    on(RiesgosActions.scenariosLoaded, (state, action) => {
        state.metaData = action.scenarios;
        return state;
    }),

    on(RiesgosActions.scenarioChosen, (state, action) => {
        state.currentScenario = action.scenario;
        return state;
    }),

    on(RiesgosActions.restartingScenario, (state, action) => {
        state.currentScenario = action.scenario;
        state[action.scenario].products.map((p: RiesgosProduct) => {
            if (isApiDatum(p)) p.value = undefined;
            if (isApiDatumReference(p)) p.reference = undefined;
        });
        return state;
    }),

    on(RiesgosActions.executeStart, (state, action) => {
        const scenario = state[action.scenario];
        const step = scenario.steps.find(s => s.id === action.step);
        step.state = new StepStateRunning();
        return state;
    }),

    on(RiesgosActions.executeSuccess, (state, action) => {
        const scenario = state[action.scenario];
        const step = scenario.steps.find(s => s.id === action.step);
        step.state = new StepStateCompleted();
        // @TODO: update state of downstream steps
        return state;
    }),

    on(RiesgosActions.executeError, (state, action) => {
        console.error(`An error has occurred during the execution of step: ${action.scenario}/${action.step}`, action.error);
        const scenario = state[action.scenario];
        const step = scenario.steps.find(s => s.id === action.step);
        step.state = new StepStateError(action.error.message);
        return state;
    }),

    on(RiesgosActions.userDataProvided, (state, action) => {
        const scenario: RiesgosScenarioState = state[action.scenario];
        for (const product of action.products) {
            for (let i = 0; i < scenario.products.length; i++) {
                if (scenario.products[i].id === product.id) {
                    scenario.products[i] = product;
                    break;
                }
            }
        }
        return state;
    })
);
