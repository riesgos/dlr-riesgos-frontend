import { createReducer, on } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import { WritableDraft } from 'immer/dist/internal';
import { RiesgosState, initialRiesgosState, RiesgosProduct, RiesgosScenarioState, RiesgosStep, ScenarioName, StepStateAvailable, StepStateCompleted, StepStateTypes, StepStateUnavailable, StepStateRunning, StepStateError, Partition } from './state';
import { scenarioLoadStart, scenarioLoadSuccess, scenarioLoadFailure, stepSelect, stepConfig, stepExecStart, stepExecSuccess, stepExecFailure, scenarioPicked, startAutoPilot, stopAutoPilot, autoPilotDequeue, updateAutoPilot, mapMove, mapClick, toggleFocus } from './actions';
import { API_ScenarioInfo } from '../services/backend.service';
import { allParasSet } from './helpers';



// @TODO: once stable, move rules into state.

const rules = {
  mirrorFocus: true,
  mirrorData: false,
  mirrorClick: true,
  mirrorMove: true,
  autoPilot: true
}




export const reducer = createReducer(
  initialRiesgosState,

  on(scenarioLoadStart, (state, action) => {
    return state;
  }),

  on(scenarioLoadSuccess, (state, action) => {
    const newState = parseAPIScenariosIntoNewState(state, action.scenarios);
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

  immerOn(stepSelect, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;

    const leftData = scenarioData.left;
    const rightData = scenarioData.right;

    leftData.active = true;
    rightData.active = true;
    
    if (action.partition === 'left' || rules.mirrorFocus) leftData.focus.focusedStep = action.stepId;
    if (action.partition === 'right' || rules.mirrorFocus) rightData.focus.focusedStep = action.stepId;

    return state;
  }),

  immerOn(stepConfig, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;
    const partitionData = scenarioData[action.partition]!;
    for (const productId in action.values) {
      const productValue = action.values[productId];
      for (const product of partitionData.products) {
        if (product.id === productId) {
          product.value = productValue;
        }
      }
    }

    if (rules.mirrorData) {
      const otherPartition = action.partition === 'left' ? 'right' : 'left';
      const otherPartitionData = scenarioData[otherPartition];
      for (const productId in action.values) {
        const productValue = action.values[productId];
        for (const product of otherPartitionData.products) {
          if (product.id === productId) {
            product.value = productValue;
          }
        }
      }
    }

    return state;
  }),

  immerOn(stepExecStart, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]![action.partition]!;
    const step = scenarioData.steps.find(s => s.step.id === action.step)!;
    step.state = new StepStateRunning();
    return state;
  }),

  immerOn(stepExecSuccess, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]![action.partition]!;
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
    const scenarioData = state.scenarioData[action.scenario]![action.partition]!;
    const step = scenarioData.steps.find(s => s.step.id === action.step)!;
    step.state = new StepStateError(action.error);
    return state;
  }),

  immerOn(startAutoPilot, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]![action.partition]!;
    scenarioState.autoPilot.useAutoPilot = true;
    return state;
  }),

  immerOn(updateAutoPilot, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]![action.partition]!;
    for (const step of scenarioState.steps) {
      for (const input of step.step.inputs) {
        const product = scenarioState.products.find(p => p.id === input.id)!;
        const productValue = product.value;
        const defaultValue = input.default;
        if (productValue) continue;
        if (defaultValue) product.value = defaultValue;
      }
    }
    const newState = deriveState(state);
    const newScenarioState = newState.scenarioData[action.scenario]![action.partition]!;
    for (const step of newScenarioState.steps) {
      if (step.state.type === "available") {
        if (allParasSet(step, newScenarioState.products)) {
          if (! newScenarioState.autoPilot.queue.includes(step.step.id)) {
            newScenarioState.autoPilot.queue.push(step.step.id);
          }
        }
      }
    }
    console.log(`Auto-pilot update. queue now contains ${scenarioState.autoPilot.queue}`)
    return newState;
  }),

  immerOn(autoPilotDequeue, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]![action.partition]!;
    scenarioState.autoPilot.queue = scenarioState.autoPilot.queue.filter(step => step != action.step);
    console.log(`Auto-pilot dequeued ${action.step}. queue now contains ${scenarioState.autoPilot.queue}`)
    return state;
  }),

  on(stopAutoPilot, (state, action) => {
    return {
      ...state,
      useAutoPilot: false
    }
  }),


  immerOn(mapMove, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]!;
    const leftState = scenarioState.left;
    const rightState = scenarioState.right;
    leftState.map.center = action.center;
    leftState.map.zoom = action.zoom;
    rightState.map.center = action.center;
    rightState.map.zoom = action.zoom;
    return state;
  }),

  immerOn(mapClick, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]!;
    const leftState = scenarioState.left;
    const rightState = scenarioState.right;
    leftState.map.clickLocation = action.location;
    rightState.map.clickLocation = action.location;
  }),


  immerOn(toggleFocus, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]![action.partition]!;
    scenarioState.active = !scenarioState.active;
    return state;
  })
);





function parseAPIScenariosIntoNewState(currentState: RiesgosState, apiScenarios: API_ScenarioInfo[]): RiesgosState {

  const scenarioData: any = {};

  for (const apiScenario of apiScenarios) {
    scenarioData[apiScenario.id] = {
      left: undefined,
      right: undefined
    };

    for (const partition of ['left', 'right'] as Partition[]) {
      const steps: RiesgosStep[] = [];
      const products: RiesgosProduct[] = [];

  
      for (const step of apiScenario.steps) {
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
  
      const partitionScenarioData = {
        scenario: apiScenario.id,
        partition: partition as Partition,
        active: partition === 'left' ? true : false,
        autoPilot: {
          useAutoPilot: false,
          queue: []
        },
        products: products,
        steps: steps,
        map: {
          center: [-50, -20],
          zoom: 4,
          clickLocation: undefined
        },
        focus: {
          focusedStep: currentState.scenarioData[apiScenario.id] ? currentState.scenarioData[apiScenario.id]![partition].focus.focusedStep : undefined
        }
      }

      scenarioData[apiScenario.id][partition] = partitionScenarioData;
    }

  }

  const metaData = apiScenarios.map(s => ({
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
    const scenarioData = state.scenarioData[scenarioName as ScenarioName];
    for (const scenario of [scenarioData?.left, scenarioData?.right]) {
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
    }
  return state;
}

