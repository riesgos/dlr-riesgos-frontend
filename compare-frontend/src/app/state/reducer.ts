import { createReducer, on } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import { RiesgosState, initialRiesgosState, RiesgosProduct, RiesgosStep, ScenarioName, StepStateAvailable, StepStateCompleted, StepStateTypes, StepStateUnavailable, StepStateRunning, StepStateError, PartitionName, RiesgosScenarioState, RiesgosScenarioMetadata } from './state';
import { ruleSetPicked, scenarioLoadStart, scenarioLoadSuccess, scenarioLoadFailure, stepSetFocus, stepConfig, stepExecStart, stepExecSuccess, stepExecFailure, scenarioPicked, autoPilotDequeue, autoPilotEnqueue, mapMove, mapClick, togglePartition, stepReset, mapLayerVisibility, movingBackToMenu, openModal, closeModal, toggleWizard, stepResetAll, setLinkMapViews, stepChange, dontShowAgainModal } from './actions';
import { API_ScenarioInfo } from '../services/backend.service';
import { allParasSet, getMapPositionForStep, offsetCenterForPartition } from './helpers';
import { Rules, getRules } from './rules';



export const reducer = createReducer(
  initialRiesgosState,

  immerOn(ruleSetPicked, (state, action) => {
    const rules = getRules(state.rules);
    state.rules = action.rules;
  }),

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

  immerOn(scenarioPicked, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario];
    if (!scenarioData) return state;

    for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
      partitionData.active = true;
    }

    const rules = getRules(state.rules);
    if (rules.focusFirstStepImmediately) {
      for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
        for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
          const firstStep = partitionData.steps[0].step.id;
          partitionData.focus.focusedSteps = [firstStep];
          const {center, zoom} = getMapPositionForStep(action.scenario, partitionName as any, firstStep);
          partitionData.map.center = center;
          partitionData.map.zoom = zoom;
        }
      }
    }


    if (rules.focusFirstStepImmediately) {
      for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
        for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
          const configurable = partitionData.products.map(p => p.id).filter(id => rules.allowConfiguration(id));
          const nonConfigurable = partitionData.products.map(p => p.id).filter(id => !configurable.includes(id));
          setValuesToDefaults(rules, partitionData, nonConfigurable);
        }
      }
    }

    state.userChoiceLinkMapViews = undefined;

    state.currentScenario = action.scenario;
    return state;
  }),

  immerOn(movingBackToMenu, (state, action) => {
    state.rules = undefined;
    state.currentScenario = 'none';
  }),

  immerOn(stepSetFocus, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;
    const partitionData = scenarioData[action.partition]!;
    const rules = getRules(state.rules);

    function handle(pd: RiesgosScenarioState, action: ReturnType<typeof stepSetFocus>) {
      if (!partitionData.controlExpanded) partitionData.controlExpanded = true;
      if (action.focus === false) {
        pd.focus.focusedSteps = pd.focus.focusedSteps.filter(s => s !== action.stepId);
      } else {
        if (rules.oneFocusOnly) pd.focus.focusedSteps = [action.stepId];
        else if (!pd.focus.focusedSteps.includes(action.stepId)) pd.focus.focusedSteps.push(action.stepId);
      }
    }

    if (rules.mirrorStepFocus(state.userChoiceLinkMapViews)) {
      for (const [otherPartition, otherPartitionData] of Object.entries(scenarioData)) {
        handle(otherPartitionData, action);
      }
    } else {
      handle(partitionData, action);
    }

    return state;
  }),

  immerOn(stepConfig, (state, action) => {

    const scenarioData = state.scenarioData[action.scenario]!;
    const partitionData = scenarioData[action.partition]!;
    const rules = getRules(state.rules);

    function handle(pd: RiesgosScenarioState, action: ReturnType<typeof stepConfig>) {
      for (const [productId, productValue] of Object.entries(action.values)) {
        for (const product of pd.products) {
          if (product.id === productId) {
            product.value = productValue;
          }
        }
      }
    }

    if (rules.mirrorData) {
      for (const [otherPartition, otherPartitionData] of Object.entries(scenarioData)) {
        handle(otherPartitionData, action);
      }
    } else {
      handle(partitionData, action);
    }

    return state;
  }),

  immerOn(stepChange, (state, action) => {
    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      if (scenarioName === action.scenario) {
        for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
          if (partitionName === action.partition) {
            for (const step of partitionData.steps) {
              if (step.step.id === action.stepId) {
                step.step = action.newData;
              }
            }
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
    const scenarioData = state.scenarioData[action.scenario]!;
    const partitionData = scenarioData[action.partition]!;
    const rules = getRules(state.rules);

    function updateProducts(partitionData: RiesgosScenarioState, action: ReturnType<typeof stepExecSuccess>) {
      const step = partitionData.steps.find(s => s.step.id === action.step)!;
      step.state = new StepStateCompleted();
  
      for (const newProduct of action.newData) {
        const oldProduct = partitionData.products.find(p => p.id === newProduct.id);
        if (oldProduct) {
          if (newProduct.options) oldProduct.options = newProduct.options;
          if (newProduct.reference) oldProduct.reference = newProduct.reference;
          if (newProduct.value) oldProduct.value = newProduct.value;
        } else {
          partitionData.products.push(newProduct);
        }
      }
    }

    // update products ... potentially in other partitions, too
    if (rules.mirrorData) {
      for (const [otherPartition, otherPartitionData] of Object.entries(scenarioData)) {
        updateProducts(otherPartitionData, action);
      }
    } else {
      updateProducts(partitionData, action);
    }

    const newState = deriveState(state);
    return newState;
  }),

  immerOn(stepExecFailure, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;
    const partitionData = scenarioData[action.partition]!;
    const step = partitionData.steps.find(s => s.step.id === action.step)!;
    step.state = new StepStateError(action.error);
    return state;
  }),

  immerOn(stepResetAll, (state, action) => {
    const rules = getRules(state.rules);
    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      if (scenarioName === action.scenario) {
        for (const [partitionName, partitionData] of Object.entries(scenarioData)) {

          // 1: set all products to none
          if (partitionName === action.partition || rules.mirrorReset) {
            for (const step of partitionData.steps) {
              for (const output of step.step.outputs) {
                const product = partitionData.products.find(p => p.id === output.id);
                if (product) {
                  if (product.value) product.value = undefined;
                  if (product.reference) product.reference = undefined;
                }
              }
            }

            // 2: empty queue
            partitionData.autoPilot.queue = [];

            // 3: cancel running processes
            for (const step of partitionData.steps) {
              if (step.state.type === StepStateTypes.running) {
                step.state = {type: StepStateTypes.unavailable};
              }
            }

            // 4: activating first step
            partitionData.focus.focusedSteps = [partitionData.steps[0].step.id];
            
          }
        }
      }
    }
    state = deriveState(state);
    return state;
  }),

  immerOn(autoPilotEnqueue, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]![action.partition]!;
    const rules = getRules(state.rules);

    // set default values for auto-pilotable steps
    let autoPilotable = scenarioState.steps.map(s => s.step.id).filter(id => rules.autoPilot(id));
    for (const step of scenarioState.steps) {
      if (autoPilotable.includes(step.step.id)) {
        for (const input of step.step.inputs) {
          const product = scenarioState.products.find(p => p.id === input.id)!;
          const productValue = product.value;
          const defaultValue = rules.productDefault(action.scenario, product.id) || input.default;
          if (productValue) continue;
          if (defaultValue) product.value = defaultValue;
        }
      }
    }

    const newState = deriveState(state);
    const newScenarioState = newState.scenarioData[action.scenario]![action.partition]!;

    // enqueue auto-pilotable steps
    for (const step of newScenarioState.steps) {
      if (step.state.type === "available" && autoPilotable.includes(step.step.id)) {
        if (allParasSet(step, newScenarioState.products)) {
          if (! newScenarioState.autoPilot.queue.includes(step.step.id)) {
            newScenarioState.autoPilot.queue.push(step.step.id);
          }
        }
      }
    }
    console.log(`Auto-pilot enqueued. Queue now contains ${scenarioState.autoPilot.queue}`);

    return newState;
  }),

  immerOn(autoPilotDequeue, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]![action.partition]!;
    scenarioState.autoPilot.queue = scenarioState.autoPilot.queue.filter(step => step != action.step);
    console.log(`Auto-pilot dequeued ${action.step}. Queue now contains ${scenarioState.autoPilot.queue}`)
    return state;
  }),

  immerOn(mapMove, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]!;
    const partitionData = scenarioState[action.partition]!;
    const rules = getRules(state.rules);

    partitionData.map.center = action.center;
    partitionData.map.zoom = action.zoom;

    if (rules.mirrorMove(state.userChoiceLinkMapViews)) {
      for (const [otherPartition, otherPartitionData] of Object.entries(scenarioState)) {
        if (otherPartition !== action.partition) {
          // otherPartitionData.map.center = offsetCenterForPartition(action.center, action.zoom, action.partition, otherPartition as PartitionName);
          otherPartitionData.map.center = action.center;
          otherPartitionData.map.zoom = action.zoom;
        }
      }
    }

    return state;
  }),

  immerOn(mapClick, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]!;
    const partitionData = scenarioState[action.partition]!;
    const rules = getRules(state.rules);

    partitionData.map.clickLocation = action.location;

    const doMirror = () => {
      for (const [otherPartition, otherPartitionData] of Object.entries(scenarioState)) {
        if (otherPartition !== action.partition) {
            otherPartitionData.map.clickLocation = action.location;
        }
      }
    }

    const compositeId = action.clickedFeature?.compositeId || "";
    if (rules.mirrorClick(state.userChoiceLinkMapViews, compositeId)) doMirror();

    return state;
  }),

  immerOn(mapLayerVisibility, (state, action) => {
    const rules = getRules(state.rules);

    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      if (scenarioName === action.scenario) {
        for (const [partition, partitionData] of Object.entries(scenarioData)) {
          if (partition === action.partition || rules.mirrorOpacity(state.userChoiceLinkMapViews)) {
            for (const setting of action.config) {
              const foundEntry = partitionData.map.layerSettings.find(entry => entry.layerCompositeId === setting.layerCompositeId);
              if (foundEntry) foundEntry.visible = setting.visible;
              else partitionData.map.layerSettings.push(setting);
            }
          }
        }
      }
    }
    return state;
  }),

  immerOn(togglePartition, (state, action) => {
    const partitionData = state.scenarioData[action.scenario]![action.partition]!;
    partitionData.active = !partitionData.active;
    return state;
  }),

  immerOn(toggleWizard, (state, action) => {
    const rules = getRules(state.rules);

    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      if (scenarioName === action.scenario) {
        for (const [partition, partitionData] of Object.entries(scenarioData)) {
          if (partition === action.partition || rules.mirrorWizard) {
            partitionData.controlExpanded = action.expand;
          }
        }
      }
    }
    return state;
  }),

  immerOn(openModal, (state, action) => {
    const partitionData = state.scenarioData[action.scenario]![action.partition]!;

    // if in `dontShowAgainList`, then dont show it.
    const modalId = action.args?.id;
    if (modalId && partitionData.modal.dontShowAgain.includes(modalId)) {
      if (partitionData.modal.args && partitionData.modal.args.id === modalId) {
        partitionData.modal.args = undefined;
      }
      return state;
    }
    
    partitionData.modal.args = action.args;
    return state;
  }),

  immerOn(closeModal, (state, action) => {
    const partitionData = state.scenarioData[action.scenario]![action.partition]!;
    partitionData.modal.args = undefined;
    return state;
  }),


  immerOn(dontShowAgainModal, (state, action) => {
    const partitionData = state.scenarioData[action.scenario]![action.partition]!;
    partitionData.modal.args = undefined;
    partitionData.modal.dontShowAgain.push(action.modalId);
    return state;
  }),


  immerOn(setLinkMapViews, (state, action) => {
    state.userChoiceLinkMapViews = action.linkMapViews;
    return state;
  })
);





function parseAPIScenariosIntoNewState(currentState: RiesgosState, apiScenarios: API_ScenarioInfo[]): RiesgosState {
  const rules = getRules(currentState.rules);
  const newScenariosData: RiesgosState["scenarioData"] = {};

  for (const apiScenario of apiScenarios) {
    const newScenarioData: {[key in PartitionName]?: RiesgosScenarioState} = {};
    let currentScenarioData = currentState.scenarioData[apiScenario.id];
    if (!currentScenarioData) currentScenarioData = {};

    for (const partition of ['left', 'right', 'middle'] as PartitionName[]) {
      // @TODO: middle partition doesnt need all that data ... only needs modal

      const newSteps: RiesgosStep[] = [];
      const newProducts: RiesgosProduct[] = [];
  
      for (const step of apiScenario.steps) {

        newSteps.push({
          step: step,
          state: new StepStateUnavailable()
        })
  
        for (const input of step.inputs) {
          if (!newProducts.find(p => p.id === input.id)) {
            newProducts.push({
              id: input.id
            });
          }
          if (input.options) {
            const product = newProducts.find(p => p.id === input.id);
            if (!product) throw Error(`No such product: ${input.id}`);
            product.options = input.options;
          }
        }

        for (const output of step.outputs) {
          if (!newProducts.find(p => p.id === output.id)) {
            newProducts.push({
              id: output.id
            });
          }
        }

      }
  
      let currentPartitionData = currentScenarioData[partition];
      if (!currentPartitionData) currentPartitionData = {
        partition: partition,
        scenario: apiScenario.id,
        active: false,
        autoPilot: {
          queue: [],
        },
        focus: {
          focusedSteps: []
        },
        map: {
          center: [-30, -70],
          zoom: 7,
          clickLocation: undefined,
          layerSettings: []
        },
        products: newProducts,
        steps: newSteps,
        modal: {
          args: undefined,
          dontShowAgain: []
        },
        controlExpanded: true
      };
      
      const newPartitionData: RiesgosScenarioState = {
        ... currentPartitionData,
        products: newProducts,
        steps: newSteps,
      }

      newScenarioData[partition] = newPartitionData;
    }
    newScenariosData[apiScenario.id] = newScenarioData;
  }

  const newMetaData: RiesgosScenarioMetadata[] = apiScenarios.map(s => ({
    id: s.id,
    description: s.description,
    title: s.id,
    preview: ''
  }));

  const newState: RiesgosState = {
    ...currentState,
    metaData: newMetaData,
    scenarioData: newScenariosData,
  };

  const state = deriveState(newState);

  return state;
}


function deriveState(state: RiesgosState) {
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

function setValuesToDefaults(rules: Rules, partitionData: RiesgosScenarioState, ids: string[]) {
  for (const id of ids) {
    const product = partitionData.products.find(p => p.id === id);
    const stepInput = partitionData.steps.map(s => s.step.inputs).flat().find(i => i.id === id);
    if (!stepInput) continue;
    if (product?.value) {
      product.options = [product.value];
      stepInput.options = product.options;
      if (stepInput && stepInput.options) stepInput.options = [product.value];
    } else if (product?.reference) {
      product.options = [product.reference];
      stepInput.options = product.options;
      if (stepInput && stepInput.options) stepInput.options = [product.reference];
    } else if (rules.productDefault(partitionData.scenario, id)) {
      const userDefinedDefault = rules.productDefault(partitionData.scenario, id);
      if (product) product.value = userDefinedDefault;
      if (product) product.options = [userDefinedDefault];
      stepInput.options = [userDefinedDefault];
    } else if (product?.options) {
      product.value = product.options[0];
      console.log("only one option for ", partitionData.scenario, product.id)
      product.options = [product.options[0]];
      stepInput.options = product.options;
    }

  }
}
