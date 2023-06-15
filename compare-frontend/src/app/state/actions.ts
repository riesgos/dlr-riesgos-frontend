import { createAction, props } from '@ngrx/store';
import { API_ScenarioInfo } from '../services/backend.service';
import { Partition, RiesgosProduct, ScenarioName } from './state';
import { RuleSetName } from './rules';


export const ruleSetPicked = createAction('Rule-set picked', props<{ rules: RuleSetName }>());

export const scenarioLoadStart = createAction('Scenario load start');
export const scenarioLoadSuccess = createAction('Scenario load success', props<{ scenarios: API_ScenarioInfo[] }>());
export const scenarioLoadFailure = createAction('Scenario load failure', props<{ error: any }>());
export const scenarioPicked = createAction('Scenario picked', props<{ scenario: ScenarioName }>());

export const stepSetFocus = createAction('Step select', props<{ scenario: ScenarioName, partition: Partition, stepId: string, focus: boolean }>());
export const stepConfig = createAction('Step config', props<{ scenario: ScenarioName, partition: Partition, stepId: string, values: {[key: string]: any } }>());
export const stepExecStart = createAction('Step exec start', props<{ scenario: ScenarioName, partition: Partition, step: string }>());
export const stepExecSuccess = createAction('Step exec success', props<{ scenario: ScenarioName, partition: Partition, step: string, newData: RiesgosProduct[] }>());
export const stepExecFailure = createAction('Step exec failure', props<{ scenario: ScenarioName, partition: Partition, step: string, error: any }>());
export const stepReset = createAction('Step reset', props<{ scenario: ScenarioName, partition: Partition, stepId: string }>());

export const autoPilotEnqueue = createAction('Auto-pilot: enqueing', props<{ scenario: ScenarioName, partition: Partition }>());
export const autoPilotDequeue = createAction('Auto-pilot: dequeuing', props<{ scenario: ScenarioName, partition: Partition, step: string }>());

export const mapMove = createAction('Map move', props<{ scenario: ScenarioName, partition: Partition, zoom: number, center: number[] }>());
export const mapClick = createAction('Map click', props<{ scenario: ScenarioName, partition: Partition, location: number[] | undefined, clickedFeature?: {compositeId: string} }>());
export const mapLayerOpacity = createAction('Map layer opacity', props<{ scenario: ScenarioName, partition: Partition, layerCompositeId: string, opacity: number }>());

export const togglePartition = createAction('Toggling partition', props<{ scenario: ScenarioName, partition: Partition }>());