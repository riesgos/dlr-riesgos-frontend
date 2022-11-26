import { createReducer, on } from '@ngrx/store';
import { initialRiesgosState, isRiesgosUnresolvedRefProduct, isRiesgosResolvedRefProduct, RiesgosProduct, RiesgosScenarioState, RiesgosState, RiesgosStep, ScenarioName, StepStateAvailable, StepStateCompleted, StepStateError, StepStateRunning, StepStateUnavailable, isRiesgosValueProduct, StepStateTypes } from './riesgos.state';
import * as RiesgosActions from './riesgos.actions';
import { API_ScenarioInfo } from '../services/backend/backend.service';
import { immerOn } from 'ngrx-immer/store';
import { WritableDraft } from 'immer/dist/internal';



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

    immerOn(RiesgosActions.restartingFromStep,  (state, action) => {
        const stepId = action.step;
        const stateWithoutData = removeDownstreamData(stepId, state);
        const newState = deriveState(stateWithoutData);
        return newState;
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
        for (const newProduct of action.newData) {
            for (let i = 0; i < scenario.products.length; i++) {
                if (newProduct.id === scenario.products[i].id) {
                    scenario.products[i] = newProduct;
                    break;
                }
            }
        }
        state = deriveState(state);
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
                    scenario.products.splice(i, 1, product);
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

    const state = deriveState(initialState);

    return state;
}

function deriveState(state: WritableDraft<RiesgosState>) {
    for (const scenarioName in state.scenarioData) {
        const scenario = state.scenarioData[scenarioName];
        for (const step of scenario.steps) {
            
            // doesn't mess with manually-set states (Running, Error)
            if (step.state.type === StepStateTypes.running || step.state.type === StepStateTypes.error) continue;

            const inputIds = step.step.inputs.map(i => i.id);
            const inputs = inputIds.map(i => scenario.products.find(p => p.id === i));
            const hasMissingInputs = !!inputs.find(i => !(i.value) && !(i.reference) && !(i.options) );

            const outputIds = step.step.outputs.map(o => o.id);
            const outputs = outputIds.map(o => scenario.products.find(p => p.id === o));
            const hasMissingOutputs = !!outputs.find(o => !(o.value) && !(o.reference) );

            if (!hasMissingOutputs) step.state = new StepStateCompleted();
            else if (hasMissingInputs) step.state = new StepStateUnavailable();
            else if (!hasMissingInputs) step.state = new StepStateAvailable();
        }
    }
    return state;
}

function removeDownstreamData(stepId: string, state: WritableDraft<RiesgosState>) {
    const scenario = state.scenarioData[state.currentScenario];
    const step = scenario.steps.find(s => s.step.id === stepId);
    const outputIds = step.step.outputs.map(o => o.id);

    const queue = new NonRepeatingQueue();
    outputIds.map(datumId => queue.enqueue(datumId));

    while (queue.data.length > 0) {
        const datumId = queue.dequeue();
        const datum = scenario.products.find(p => p.id === datumId);
        if (datum.value) datum.value = undefined;
        if (datum.reference) datum.reference = undefined;

        const consumerSteps = scenario.steps.filter(s => s.step.inputs.map(i => i.id).includes(datumId));
        for (const consumerStep of consumerSteps) {
            const outputIds = consumerStep.step.outputs.map(o => o.id);
            outputIds.map(datumId => queue.enqueue(datumId));
        }
    }

    return state;
}

class NonRepeatingQueue {
    alreadySeen = [];
    data = [];

    constructor () {}

    enqueue(datum: string) {
        if (this.alreadySeen.includes(datum)) return;
        this.alreadySeen.push(datum);
        this.data.push(datum);
    }

    dequeue() {
        return this.data.shift();
    }
}