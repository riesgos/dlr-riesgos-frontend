import { createReducer, on } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';
import { initialRiesgosState, ScenarioName, PartitionName, RiesgosScenarioState, RiesgosScenarioControlState, LayerDescription, StepStateTypes } from './state';
import { ruleSetPicked, scenarioLoadStart, scenarioLoadSuccess, scenarioLoadFailure, stepSetFocus, stepConfig, stepExecStart, stepExecSuccess, stepExecFailure, scenarioPicked, autoPilotDequeue, autoPilotEnqueue, mapMove, mapClick, togglePartition, stepReset, mapLayerVisibility, movingBackToMenu, openModal, closeModal, popupClose } from './actions';
import { API_ScenarioInfo, API_ScenarioState, isApiDatum } from '../services/backend.service';
import { allParasSet } from './helpers';
import { getRules } from './rules';
import { findLayerDescriptionFactory, getMapCenter, getMapZoom } from './augmenters';



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

        const apiData = apiStateFromApiInfo(scenarioInfo);
        const controls = updateControlsFromInfo(scenarioInfo.id, partitionName, scenarioInfo, apiData, []);

        const partitionDatum: RiesgosScenarioState = {
          scenario: scenarioInfo.id,
          partition: partitionName,
          apiData: apiData,
          apiSteps: scenarioInfo,
          active: true,
          autoPilot: {queue: []},
          controls: controls,
          map: {
            center: getMapCenter(scenarioInfo.id),
            zoom: getMapZoom(scenarioInfo.id),
            clickLocation: undefined,
            layers: updateLayersFromInfo(scenarioInfo.id, partitionName, scenarioInfo)
          },
          modal: {},
        };
        partitionData[partitionName] = partitionDatum;
      }
      state.scenarioData[scenarioInfo.id] = partitionData;
    }

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
    const rules = getRules(state.rules);

    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      if (scenarioName === action.scenario) {
        for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
          if (partitionName == action.partition || rules.mirrorFocus) {

            const control = partitionData.controls.find(c => c.stepId === action.stepId);
            if (!control) continue;
            if (rules.oneFocusOnly) partitionData.controls.map(c => c.hasFocus = false);
            control.hasFocus = action.focus;

          }
        }
      }
    }



    return state;
  }),

  immerOn(stepConfig, (state, action) => {

    const rules = getRules(state.rules);

    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      if (scenarioName === action.scenario) {
        for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
          if (partitionName === action.partition || rules.mirrorData) { 
            partitionData.apiData = updateApiDataFromSelection(action.stepId, action.values, partitionData.apiSteps, partitionData.apiData);
            partitionData.map.layers = updateLayersFromData(scenarioName, partitionName as PartitionName, action.stepId, partitionData.apiSteps, partitionData.apiData, partitionData.map.layers);
            partitionData.controls = updateControlsFromData(scenarioName, partitionName as PartitionName,                partitionData.apiSteps, partitionData.apiData, partitionData.map.layers, partitionData.controls);
          }
        }
      }
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
    const rules = getRules(state.rules);

    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      if (scenarioName === action.scenario) {
        for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
          if (partitionName === action.partition || rules.mirrorData) {
            partitionData.apiData = action.newData;
            partitionData.map.layers = updateLayersFromData(action.scenario, partitionName as PartitionName, action.step, partitionData.apiSteps, partitionData.apiData, partitionData.map.layers);
            partitionData.controls = updateControlsFromData(action.scenario, partitionName as PartitionName,              partitionData.apiSteps, partitionData.apiData, partitionData.map.layers, partitionData.controls);
          }
        }
      }
    }

    return state;
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
    const rules = getRules(state.rules);

    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      if (scenarioName === action.scenario) {
        for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
          if (partitionName === action.partition) {
            partitionData.apiData = updateApiDataFromDefaults(partitionData.apiSteps, partitionData.apiData);
            // partitionData.map.layers = deriveLayersFromData(action.scenario, partitionName, action.step, partitionData.apiSteps, partitionData.apiData, partitionData.map.layers);
            partitionData.controls = updateControlsFromData(scenarioName, partitionName,                 partitionData.apiSteps, partitionData.apiData, partitionData.map.layers, partitionData.controls);
          }
        }
      }
    }

    // enqueue auto-pilotable steps
    const scenarioState = state.scenarioData[action.scenario]![action.partition]!;
    for (const control of scenarioState.controls) {
      if (control.state === "available" && rules.autoPilot(control.stepId)) {
        if (allParasSet(control)) {
          if (! scenarioState.autoPilot.queue.includes(control.stepId)) {
            scenarioState.autoPilot.queue.push(control.stepId);
          }
        }
      }
    }
    console.log(`Auto-pilot enqueued. Queue now contains ${scenarioState.autoPilot.queue}`);

    return state;
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

  immerOn(popupClose, (state, action) => {
    const rules = getRules(state.rules);
    for (const [scenarioName, scenarioData] of Object.entries(state.scenarioData)) {
      for (const [partitionName, partitionData] of Object.entries(scenarioData)) {
        if (scenarioName === action.scenario && partitionName === action.partition) {
          partitionData.map.clickLocation = undefined;
        }
        else if (rules.mirrorClick) {
          partitionData.map.clickLocation = undefined;
        }
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

function updateControlsFromInfo(scenario: ScenarioName, partition: PartitionName, apiSteps: API_ScenarioInfo, apiData: API_ScenarioState, controls: RiesgosScenarioControlState[]): RiesgosScenarioControlState[] {
  for (const stepInfo of apiSteps.steps) {

    let control = controls.find(c => c.stepId === stepInfo.id);
    if (!control) {
      control = { stepId: stepInfo.id, configs: [], hasFocus: false, isAutoPiloted: false, layers: [], state: "available", title: stepInfo.title };
      controls.push(control);
    }

    for (const inputInfo of stepInfo.inputs) {
      let config = control.configs.find(c => c.id === inputInfo.id);
      if (!config) {
        config = {id: inputInfo.id, label: inputInfo.id + '_label', options: [], selected: undefined, default: inputInfo.default};
        control.configs.push(config);
      }
      if (inputInfo.options) {
        for (const option of inputInfo.options) {
          config.options.push(option);
        }
      }
    }

    control.state = getControlStateFromData(control, apiSteps, apiData);
  }
  return controls;
}

function updateControlsFromData(scenario: ScenarioName, partition: PartitionName, apiSteps: API_ScenarioInfo, apiData: API_ScenarioState, layers: LayerDescription[], controls: RiesgosScenarioControlState[]): RiesgosScenarioControlState[] {
  for (const control of controls) {
    for (const datumInfo of apiData.data) {
      const config = control.configs.find(c => c.id === datumInfo.id);
      if (!config) continue;
      if (isApiDatum(datumInfo)) {
        config.selected = datumInfo.value;
      } else {
        // config.selected = datumInfo;
        // @TODO: will this work?
        // If it doesn't, we'll have to either:
        //  1. make configs like layers in that we pass in not the final config, but rather instructions on how to create the final config based on the given API_Data | API_Reference. The reference will only be resolved inside the Wizard-Component, then.
        //  2. create a resolve-workflow in redux to get those values. however, if we do that, the resolved data needs to be stored in the state ... which might become very big. Maybe this would be alright for individual references, but surely not for all. 
      }
    }
    control.state = getControlStateFromData(control, apiSteps, apiData);
  }


  return controls;
}

function getControlStateFromData(control: RiesgosScenarioControlState, apiSteps: API_ScenarioInfo, apiData: API_ScenarioState): StepStateTypes {
    // don't mess with manually set states
    if (control.state === "running" || control.state === "error") return control.state;

    const step = apiSteps.steps.find(s => s.id === control.stepId);
    if (!step) return control.state;

    const inputIds  = step.inputs.map(i => i.id);
    const outputIds = step.outputs.map(i => i.id);
    const inputValues  = apiData.data.filter(d => inputIds.includes(d.id));
    const outputValues = apiData.data.filter(d => outputIds.includes(d.id));

    const allOutputsSet = outputValues.find(o => isApiDatum(o) ? !!o.value : !!o.reference);
    // const allInputsSet  = inputValues.find(i => isApiDatum(i) ? !!i.value : !!i.reference);
    let allInputsSetable = true;
    for (const inputId of inputIds) {
      const inputConfig = step.inputs.find(i => i.id === inputId);
      const inputValue = inputValues.find(i => i.id === inputId)!;
      const hasValue = !!(isApiDatum(inputValue) ? inputValue.value : inputValue?.reference);
      if (!inputConfig?.options && !hasValue) allInputsSetable = false;
    }

    if (allOutputsSet) return "completed";
    else if (allInputsSetable) return "available";
    else if (!allInputsSetable) return "unavailable";

    return control.state;
}

function updateLayersFromData(scenario: ScenarioName, partition: PartitionName, stepId: string, apiSteps: API_ScenarioInfo, apiValues: API_ScenarioState, layers: LayerDescription[]): LayerDescription[] {
  const layerConverter = findLayerDescriptionFactory(scenario, partition, stepId);
  if (!layerConverter) return [];
  const newLayers = layerConverter.fromProducts(apiSteps, apiValues, layers);
  return newLayers;
}

function updateLayersFromInfo(scenario: ScenarioName, partition: PartitionName, apiSteps: API_ScenarioInfo): LayerDescription[] {
  let layers: LayerDescription[] = [];
  for (const step of apiSteps.steps) {
    const newLayers = updateLayersFromData(scenario, partition, step.id, apiSteps, {data: []}, []);
    layers = layers.concat(...newLayers);
  }
  return layers;
}

function updateApiDataFromSelection(stepId: string, selectedValues: { [parameterId: string]: any; }, apiSteps: API_ScenarioInfo, apiData: API_ScenarioState): API_ScenarioState {
  // const stepInfo = apiSteps.steps.find(s => s.id === stepId);
  // if (!stepInfo) return apiData;
  const parameterIds = Object.keys(selectedValues);
  for (let i = 0; i < apiData.data.length; i++) {
    const datum = apiData.data[i];
    if (parameterIds.includes(datum.id)) {
      apiData.data[i] = {
        id: datum.id,
        value: selectedValues[datum.id]
      }
    }
  }
  return apiData;
}

function updateApiDataFromDefaults(apiSteps: API_ScenarioInfo, apiData: API_ScenarioState): API_ScenarioState {
  const allInputs = apiSteps.steps.map(s => s.inputs).flat();
  function getDefaultValue(id: string) {
    const input = allInputs.find(i => i.id === id);
    if (!input) return undefined;
    if (!input.default) return undefined;
    return input.default;
  }

  for (let i = 0; i < apiData.data.length; i++) {
    const datum = apiData.data[i];
    if (isApiDatum(datum)) {
      if (!datum.value) {
        const defaultValue = getDefaultValue(datum.id);
        if (defaultValue) {
          apiData.data[i] = {...datum, value: defaultValue};
        }
      }
    }
    else {
      if (!datum.reference) {
        const defaultValue = getDefaultValue(datum.id);
        if (defaultValue) {
          apiData.data[i] = {...datum, value: defaultValue};
        }
      }
    }
  }
  return apiData;
}



