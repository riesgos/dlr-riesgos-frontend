import { createReducer, on } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import { WritableDraft } from 'immer/dist/internal';
import { RiesgosState, initialRiesgosState, RiesgosProduct, RiesgosScenarioState, RiesgosStep, ScenarioName, StepStateAvailable, StepStateCompleted, StepStateTypes, StepStateUnavailable, ScenarioNameOrNone, StepStateRunning, StepStateError } from './state';
import { scenarioLoadStart, scenarioLoadSuccess, scenarioLoadFailure, stepSelect, stepConfig, stepExecStart, stepExecSuccess, stepExecFailure, altParaPicked, scenarioPicked } from './actions';
import { API_ScenarioInfo } from '../services/backend.service';



export const reducer = createReducer(
  initialRiesgosState,

  on(scenarioLoadStart, (state, action) => {
    return state;
  }),

  on(scenarioLoadSuccess, (state, action) => {
    const newState = parseAPIScenariosIntoState(state, action.scenarios);
    return newState;
  }),

  on(scenarioLoadFailure, (state, action) => {
    return state;
  }),

  on(scenarioPicked, (state, action) => {
    return {
      ...state,
      currentScenario: action.scenario
    }
  }),

  on(stepSelect, (state, action) => {
    return {
      ...state,
      focusState: {
        focusedStep: action.stepId
      }
    };
  }),

  immerOn(stepConfig, (state, action) => {
    const currentScenario = state.currentScenario;
    if (currentScenario === 'none') return state;
    const scenarioData = state.scenarioData[currentScenario];
    if (!scenarioData) return state;
    for (const productId in action.config.values) {
      const productValue = action.config.values[productId];
      for (const product of scenarioData.products) {
        if (product.id === productId) {
          product.value = productValue;
        }
      }
    }
    return state;
  }),

  immerOn(stepExecStart, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;
    const step = scenarioData.steps.find(s => s.step.id === action.step)!;
    step.state = new StepStateRunning();
    return state;
  }),

  immerOn(stepExecSuccess, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;
    const step = scenarioData.steps.find(s => s.step.id === action.step)!;
    step.state = new StepStateCompleted();

    for (const newProduct of action.newData) {
      const oldProduct = scenarioData.products.find(p => p.id === newProduct.id);
      if (oldProduct) {
        if (newProduct.options) oldProduct.options = newProduct.options;
        if (newProduct.reference) oldProduct.reference = newProduct.reference;
        if (newProduct.value) oldProduct.value = newProduct.value;
      } else {
        scenarioData.products.push(newProduct);
      }
    }

    const newState = deriveState(state);
    return newState;
  }),

immerOn(stepExecFailure, (state, action) => {
  const scenarioData = state.scenarioData[action.scenario]!;
  const step = scenarioData.steps.find(s => s.step.id === action.step)!;
  step.state = new StepStateError(action.error);
  return state;
}),

  on(altParaPicked, (state, action) => {
    return state;
  }),

);





function parseAPIScenariosIntoState(currentState: RiesgosState, scenarios: API_ScenarioInfo[]): RiesgosState {

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
          const product = products.find(p => p.id === input.id);
          if (!product) throw Error(`No such product: ${input.id}`);
          product.options = input.options;
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
    ...currentState,
    metaData,
    scenarioData,
  };

  const state = deriveState(initialState);

  return state;
}




function deriveState(state: WritableDraft<RiesgosState>) {
  for (const scenarioName in state.scenarioData) {
    const scenario = state.scenarioData[scenarioName as ScenarioName];
    if (scenario) {
      for (const step of scenario.steps) {

        // doesn't mess with manually-set states (Running)
        if (step.state.type === StepStateTypes.running) continue;

        const inputIds = step.step.inputs.map(i => i.id);
        const inputs = inputIds.map(i => scenario.products.find(p => p.id === i)!);
        const hasMissingInputs = !!inputs.find(i => !(i.value) && !(i.reference) && !(i.options));

        const outputIds = step.step.outputs.map(o => o.id);
        const outputs = outputIds.map(o => scenario.products.find(p => p.id === o)!);
        const hasMissingOutputs = !!outputs.find(o => !(o.value) && !(o.reference));

        if (!hasMissingOutputs) step.state = new StepStateCompleted();
        else if (hasMissingInputs) step.state = new StepStateUnavailable();
        else if (!hasMissingInputs) step.state = new StepStateAvailable();
      }
    }
  }
  return state;
}

function removeDownstreamData(stepId: string, state: WritableDraft<RiesgosState>) {
  const scenario = state.scenarioData[state.currentScenario as ScenarioName];
  if (scenario) {
    const step = scenario.steps.find(s => s.step.id === stepId)!;
    const outputIds = step.step.outputs.map(o => o.id);

    const queue = new NonRepeatingQueue();
    outputIds.map(datumId => queue.enqueue(datumId));

    while (queue.data.length > 0) {
      const datumId = queue.dequeue();
      if (!datumId) break;
      const datum = scenario.products.find(p => p.id === datumId)!;
      if (datum.value) datum.value = undefined;
      if (datum.reference) datum.reference = undefined;

      const consumerSteps = scenario.steps.filter(s => s.step.inputs.map(i => i.id).includes(datumId));
      for (const consumerStep of consumerSteps) {
        const outputIds = consumerStep.step.outputs.map(o => o.id);
        outputIds.map(datumId => queue.enqueue(datumId));
      }
    }
  }

  return state;
}

class NonRepeatingQueue {
  alreadySeen: string[] = [];
  data: string[] = [];

  constructor() { }

  enqueue(datum: string) {
    if (this.alreadySeen.includes(datum)) return;
    this.alreadySeen.push(datum);
    this.data.push(datum);
  }

  dequeue() {
    return this.data.shift();
  }
}