import { createReducer, on } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import { RiesgosState, initialRiesgosState, ScenarioName, PartitionName, RiesgosScenarioState, RiesgosScenarioControlState, LayerDescription } from './state';
import { ruleSetPicked, scenarioLoadStart, scenarioLoadSuccess, scenarioLoadFailure, stepSetFocus, stepConfig, stepExecStart, stepExecSuccess, stepExecFailure, scenarioPicked, autoPilotDequeue, autoPilotEnqueue, mapMove, mapClick, togglePartition, stepReset, mapLayerVisibility, movingBackToMenu, openModal, closeModal, layerUpdate } from './actions';
import { API_ScenarioInfo, API_ScenarioState, isApiDatum } from '../services/backend.service';
import { allParasSet } from './helpers';
import { getRules } from './rules';
import { findControlFactory, findLayerDescriptionFactory, getMapCenter, getMapZoom } from './augmenters';



export const reducer = createReducer(
  initialRiesgosState,

  immerOn(ruleSetPicked, (state, action) => {
    const rules = getRules(state.rules);
    state.rules = action.rules;
  }),

  on(scenarioLoadStart, (state, action) => {
    return state;
  }),

  immerOn(scenarioLoadSuccess, (state, action) => {

    state.metaData = action.scenarios.map(s => ({
      id: s.id,
      description: s.description,
      preview: '',
      title: s.id
    }));

    state.scenarioData = {};
    for (const scenarioInfo of action.scenarios) {
      const partitionData: {[partitionName in PartitionName]?: RiesgosScenarioState} = {};
      for (const partitionName of ['left', 'right', 'middle'] as PartitionName[]) {
        const partitionDatum: RiesgosScenarioState = {
          scenario: scenarioInfo.id,
          partition: partitionName,
          apiData: apiStateFromApiInfo(scenarioInfo),
          apiSteps: scenarioInfo,
          active: true,
          autoPilot: {queue: []},
          controls: updateControlsFromInfo(scenarioInfo.id, partitionName, scenarioInfo, []),
          map: {
            center: getMapCenter(scenarioInfo.id),
            zoom: getMapZoom(scenarioInfo.id),
            clickLocation: undefined,
            layers: getLayersFromInfo(scenarioInfo.id, partitionName, scenarioInfo)
          },
          modal: {},
          popup: {componentType: '', data: {}},
        };
        partitionData[partitionName] = partitionDatum;
      }
      state.scenarioData[scenarioInfo.id] = partitionData;
    }

    state = updateState(state);

    const rules = getRules(state.rules);
    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
        for (const control of partitionData.controls) {
          if (rules.autoPilot(control.stepId)) control.isAutoPiloted = true;
        }
        if (rules.focusFirstStepImmediately) {
          partitionData.controls[0].hasFocus = true;
        }
      }
    }

    return state;
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
          const firstStep = partitionData.controls[0];
          firstStep.hasFocus = true;
        }
      }
    }

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
      const control = pd.controls.find(c => c.stepId === action.stepId);
      if (!control) return;
      if (action.focus === false) {
        control.hasFocus = false;
      } else {
        control.hasFocus = true;
        if (rules.oneFocusOnly) pd.controls.map(c => c.hasFocus = false);
      }
    }

    if (rules.mirrorFocus) {
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
      const control = pd.controls.find(c => c.stepId === action.stepId);
      if (!control) return;
      for (const config of control.configs) {
        const value = action.values[config.id];
        if (value) config.selected = value;
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

  immerOn(stepExecStart, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]![action.partition]!;
    const control = scenarioData.controls.find(c => c.stepId === action.step)!;
    control.state === 'running';
    return state;
  }),

  immerOn(stepExecSuccess, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;
    const rules = getRules(state.rules);

    // update products ... potentially in other partitions, too
    if (rules.mirrorData) {
      for (const [otherPartition, otherPartitionData] of Object.entries(scenarioData)) {
        otherPartitionData.apiData = action.newData;
        otherPartitionData.map.layers = deriveLayersFromData(action.scenario, otherPartition as PartitionName, action.step, action.newData, otherPartitionData.map.layers);
        otherPartitionData.controls = updateControlsFromData(action.scenario, otherPartition as PartitionName, action.step, action.newData, otherPartitionData.controls);
      }
    } else {
      const partitionData = scenarioData[action.partition]!;
      partitionData.apiData = action.newData;
      partitionData.map.layers = deriveLayersFromData(action.scenario, action.partition, action.step, action.newData, partitionData.map.layers);
      partitionData.controls = updateControlsFromData(action.scenario, action.partition, action.step, action.newData, partitionData.controls);
    }

    const newState = updateState(state);
    return newState;
  }),

  immerOn(stepExecFailure, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;
    const partitionData = scenarioData[action.partition]!;
    const control = partitionData.controls.find(c => c.stepId === action.step)!;
    control.state = "error";
    control.errorMessage = action.error;
    return state;
  }),

  immerOn(stepReset, (state, action) => {
    const scenarioData = state.scenarioData[action.scenario]!;
    const partitionData = scenarioData[action.partition]!;
    const control = partitionData.controls.find(c => c.stepId === action.stepId)!;
    control.state = "available";
    return state;
  }),

  immerOn(autoPilotEnqueue, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]![action.partition]!;
    const rules = getRules(state.rules);

    // set default values for auto-pilotable steps
    for (const control of scenarioState.controls) {
      if (rules.autoPilot(control.stepId)) {
        for (const config of control.configs) {
          if (config.selected !== undefined) continue;
          if (config.default) config.selected = config.default;
        }
      }
    }

    const newState = updateState(state);
    const newScenarioState = newState.scenarioData[action.scenario]![action.partition]!;

    // enqueue auto-pilotable steps
    for (const control of newScenarioState.controls) {
      if (control.state === "available" && rules.autoPilot(control.stepId)) {
        if (allParasSet(control)) {
          if (! newScenarioState.autoPilot.queue.includes(control.stepId)) {
            newScenarioState.autoPilot.queue.push(control.stepId);
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

    if (rules.mirrorMove) {
      for (const [otherPartition, otherPartitionData] of Object.entries(scenarioState)) {
        if (otherPartition !== action.partition) {
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

    if (rules.mirrorClick) {
      for (const [otherPartition, otherPartitionData] of Object.entries(scenarioState)) {
        if (otherPartition !== action.partition) {
            otherPartitionData.map.clickLocation = action.location;
        }
      }
    };

    return state;
  }),

  immerOn(layerUpdate, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]!;
    const partitionData = scenarioState[action.partition]!;
    const layers = partitionData.map.layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].layerId === action.layer.layerId) {
        layers[i] = action.layer;
      }
    }    
    return state;
  }),

  immerOn(mapLayerVisibility, (state, action) => {
    const scenarioState = state.scenarioData[action.scenario]!;
    const rules = getRules(state.rules);

    for (const [partition, partitionData] of Object.entries(scenarioState)) {
      if (partition === action.partition) {
        const foundEntry = partitionData.map.layers.find(entry => entry.layerId === action.layerId);
        if (foundEntry) foundEntry.visible = action.visible;
      }
      else if (rules.mirrorOpacity) {
        const foundEntry = partitionData.map.layers.find(entry => entry.layerId === action.layerId);
        if (foundEntry) foundEntry.visible = action.visible;
      }
    }

  }),

  immerOn(togglePartition, (state, action) => {
    const partitionData = state.scenarioData[action.scenario]![action.partition]!;
    partitionData.active = !partitionData.active;
    return state;
  }),

  immerOn(openModal, (state, action) => {
    const partitionData = state.scenarioData[action.scenario]![action.partition]!;
    partitionData.modal.args = action.args
  }),

  immerOn(closeModal, (state, action) => {
    const partitionData = state.scenarioData[action.scenario]![action.partition]!;
    partitionData.modal.args = undefined;
  })
);





function updateControlsFromInfo(scenario: ScenarioName, partition: PartitionName, newData: API_ScenarioInfo, controls: RiesgosScenarioControlState[]): RiesgosScenarioControlState[] {
  for (const stepInfo of newData.steps) {
    let control = controls.find(c => c.stepId === stepInfo.id);
    if (!control) {
      control = { stepId: stepInfo.id, configs: [], hasFocus: false, isAutoPiloted: false, layers: [], state: "unavailable", title: stepInfo.title };
      controls.push(control);
    }
    for (const inputInfo of stepInfo.inputs) {
      let config = control.configs.find(c => c.id === inputInfo.id);
      if (!config) {
        config = {id: inputInfo.id, label: inputInfo.id + '_label', options: {}, selected: undefined, default: inputInfo.default};
        control.configs.push(config);
      }
      if (inputInfo.options) {
        const cc = findControlFactory(scenario, partition, stepInfo.id);
        for (const option of inputInfo.options) {
          if (cc) config.options[cc.optionToKey(inputInfo.id, option)] = option;
          else config.options[JSON.stringify(option)] = option;
        }
      }
    }
  }
  return controls;
}

function deriveLayersFromData(scenario: ScenarioName, partition: PartitionName, stepId: string, newData: API_ScenarioState, layers: LayerDescription[]): LayerDescription[] {
  const layerConverter = findLayerDescriptionFactory(scenario, partition, stepId);
  if (!layerConverter) return [];
  const newLayers = layerConverter.fromProducts(newData, layers);
  return newLayers;
}

function updateControlsFromData(scenario: ScenarioName, partition: PartitionName, stepId: string, newData: API_ScenarioState, controls: RiesgosScenarioControlState[]): RiesgosScenarioControlState[] {
  const control = controls.find(c => c.stepId === stepId);
  if (!control) return controls;
  for (const datumInfo of newData.data) {
    if (isApiDatum(datumInfo)) {
      const config = control.configs.find(c => c.id === datumInfo.id);
      if (!config) continue;
      config.selected = datumInfo.value;
    }
    // @TODO: what about isApiReference?
    // <-- I don't think there are any config parameters that come as references.
    // If there are, we'll have to either:
    //  1. make configs like layers in that we pass in not the final config, but rather instructions on how to create the final config based on the given API_Data | API_Reference. The reference will only be resolved inside the Wizard-Component, then.
    //  2. create a resolve-workflow in redux to get those values. however, if we do that, the resolved data needs to be stored in the state ... which might become very big. Maybe this would be alright for individual references, but surely not for all. 
  }
  return controls;
}

function updateState(state: RiesgosState) {
  for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
    for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
        for (const control of partitionData.controls) {
  
          // doesn't mess with manually-set states (Running, Error)
          if (control.state === "running" || control.state === "error") continue;
  
          const inputValues = control.configs.map(c => c.selected);
          const hasMissingInputs = !!inputValues.find(v => v === undefined);
  
          const apiStep = partitionData.apiSteps.steps.find(s => s.id === control.stepId)!;
          const outputIds = apiStep.outputs.map(o => o.id);
          const outputs = partitionData.apiData.data.filter(d => outputIds.includes(d.id));
          const hasMissingOutputs = !!outputs.find(o => isApiDatum(o) ? !o.value : !o.reference);
  
          if (!hasMissingOutputs) control.state = "completed";
          else if (hasMissingInputs) control.state = "unavailable";
          else if (!hasMissingInputs) control.state = "available";
        }
      }
    }
  return state;
}


function apiStateFromApiInfo(scenarioInfo: API_ScenarioInfo): API_ScenarioState {
  const state: API_ScenarioState = {data: []};
  const seenIds: string[] = [];
  for (const step of scenarioInfo.steps) {
    for (const input of step.inputs) {
      if (!seenIds.includes(input.id)) {
        state.data.push({id: input.id, value: undefined});
        seenIds.push(input.id);
      }
    }
    for (const output of step.outputs) {
      if (!seenIds.includes(output.id)) {
        state.data.push({id: output.id, value: undefined});
        seenIds.push(output.id);
      }
    }
  }
  return state;
}

function getLayersFromInfo(scenario: ScenarioName, partition: PartitionName, scenarioInfo: API_ScenarioInfo): LayerDescription[] {
  let layers: LayerDescription[] = [];
  for (const step of scenarioInfo.steps) {
    const layerConverter = findLayerDescriptionFactory(scenario, partition, step.id);
    if (!layerConverter) continue;
    const newLayers = layerConverter.fromInfo(step);
    layers = layers.concat(...newLayers);
  }
  return layers;
}

