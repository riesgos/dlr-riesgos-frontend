import { createReducer, on } from '@ngrx/store';
import { initialRiesgosState, isRiesgosUnresolvedRefProduct, isRiesgosResolvedRefProduct, RiesgosProduct, RiesgosScenarioState, RiesgosState, RiesgosStep, ScenarioName, StepStateAvailable, StepStateCompleted, StepStateError, StepStateRunning, StepStateUnavailable, isRiesgosValueProduct } from './riesgos.state';
import * as RiesgosActions from './riesgos.actions';
import { API_ScenarioInfo } from '../services/backend/backend.service';
import { immerOn } from 'ngrx-immer/store';



export const reducer = createReducer(
    initialRiesgosState,

    on(RiesgosActions.scenariosLoaded, (state, action) => {
        const newState = parseAPIScenariosIntoState(state.currentScenario, action.scenarios);
        return newState;
    }),

    on(RiesgosActions.scenarioChosen, (state, action) => {
        return {
            ...state,
            currentScenario: action.scenario
        };
    }),

    immerOn(RiesgosActions.restartingScenario, (state, action) => {
        state.currentScenario = action.scenario;
        state.scenarioData[action.scenario].products.map(p => {
            if (isRiesgosResolvedRefProduct(p)) p.value = undefined;
            if (isRiesgosUnresolvedRefProduct(p)) p.reference = undefined;
            if (isRiesgosValueProduct(p)) p.value = undefined;
        });
        return state;
    }),

    immerOn(RiesgosActions.executeStart, (state, action) => {
        const scenario = state.scenarioData[action.scenario];
        const step = scenario.steps.find(s => s.step.id === action.step);
        step.state = new StepStateRunning();
        return state;
    }),

    immerOn(RiesgosActions.executeSuccess, (state, action) => {
        const scenario = state.scenarioData[action.scenario];
        const step = scenario.steps.find(s => s.step.id === action.step);
        step.state = new StepStateCompleted();
        // @TODO: update state of downstream steps
        return state;
    }),

    immerOn(RiesgosActions.executeError, (state, action) => {
        console.error(`An error has occurred during the execution of step: ${action.scenario}/${action.step}`, action.error);
        const scenario = state.scenarioData[action.scenario];
        const step = scenario.steps.find(s => s.step.id === action.step);
        step.state = new StepStateError(action.error.message);
        return state;
    }),

    immerOn(RiesgosActions.userDataProvided, (state, action) => {
        const scenario = state.scenarioData[action.scenario];
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


function parseAPIScenariosIntoState(currentScenario: ScenarioName, scenarios: API_ScenarioInfo[]): RiesgosState {

    const scenarioData: { [key: string]: RiesgosScenarioState } = {};
    for (const scenario of scenarios) {

        const steps: RiesgosStep[] = [];
        const products: RiesgosProduct[] = [];

        for (const step of scenario.steps) {
            steps.push({
                step: step,
                state: new StepStateUnavailable()
            })

            for (const input of step.inputs) {
                if (!products.find(p => p.id === input.id)) {
                    products.push({
                        id: input.id
                    });
                }
                if (input.options) {
                    products.find(p => p.id === input.id).options = input.options;
                }
            }
            for (const output of step.outputs) {
                if (!products.find(p => p.id === output.id)) {
                    products.push({
                        id: output.id
                    });
                }
            }
        }

        scenarioData[scenario.id] = {
            scenario: scenario.id as ScenarioName,
            products: products,
            steps: steps
        }
    }

    const metaData = scenarios.map(s => ({
        id: s.id,
        description: s.description,
        title: s.id,
        preview: ''
    }));

    const initialState: RiesgosState = {
        metaData, scenarioData, currentScenario
    };

    const state = updateState(initialState);

    return state;
}

function updateState(state: RiesgosState): RiesgosState {
    for (const scenarioName in state.scenarioData) {
        const scenario = state.scenarioData[scenarioName];
        for (const step of scenario.steps) {
            step.state = new StepStateAvailable();
        }
    }
    return state;
}

