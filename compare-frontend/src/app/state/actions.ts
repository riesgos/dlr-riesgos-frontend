import { createAction, props } from '@ngrx/store';
import { API_ScenarioInfo } from '../services/backend.service';
import { Partition, RiesgosProduct, RiesgosStep, ScenarioName } from './state';


export const scenarioLoadStart = createAction('Scenario load start');
export const scenarioLoadSuccess = createAction('Scenario load success', props<{ scenarios: API_ScenarioInfo[] }>());
export const scenarioLoadFailure = createAction('Scenario load failure', props<{ error: any }>());
export const scenarioPicked = createAction('Scenario picked', props<{ scenario: ScenarioName }>());

export const stepSelect = createAction('Step select', props<{ scenario: ScenarioName, partition: Partition, stepId: string }>());
export const stepConfig = createAction('Step config', props<{ scenario: ScenarioName, partition: Partition, stepId: string, values: {[key: string]: any } }>());
export const stepExecStart = createAction('Step exec start', props<{ scenario: ScenarioName, partition: Partition, step: string }>());
export const stepConfigAndExecStart = createAction('Step config and exec start', props<{ scenario: ScenarioName, partition: Partition, stepId: string, values: {[key: string]: any}}>());
export const stepExecSuccess = createAction('Step exec success', props<{ scenario: ScenarioName, partition: Partition, step: string, newData: RiesgosProduct[] }>());
export const stepExecFailure = createAction('Step exec failure', props<{ scenario: ScenarioName, partition: Partition, step: string, error: any }>());

export const startAutoPilot = createAction('Auto-pilot: Starting', props<{ scenario: ScenarioName, partition: Partition }>());
export const stopAutoPilot = createAction('Auto-pilot: Stopping', props<{ scenario: ScenarioName, partition: Partition }>());
export const updateAutoPilot = createAction('Auto-pilot: update', props<{ scenario: ScenarioName, partition: Partition }>());
export const autoPilotDequeue = createAction('Auto-pilot: dequeuing', props<{ scenario: ScenarioName, partition: Partition, step: string }>());

export const mapMove = createAction('Map move', props<{ scenario: ScenarioName, partition: Partition, zoom: number, center: number[] }>());
export const mapClick = createAction('Map click', props<{ scenario: ScenarioName, partition: Partition, location: number[] }>());