import { createAction, props } from '@ngrx/store';
import { API_ScenarioInfo } from '../services/backend.service';
import { RiesgosProduct, ScenarioName } from './state';


export const scenarioLoadStart = createAction('Scenario load start');
export const scenarioLoadSuccess = createAction('Scenario load success', props<{ scenarios: API_ScenarioInfo[] }>());
export const scenarioLoadFailure = createAction('Scenario load failure', props<{ error: any }>());
export const scenarioPicked = createAction('Scenario picked', props<{ scenario: ScenarioName }>());
export const modePicked = createAction('Mode picked', props<{ mode: string }>());

export const stepSelect = createAction('Step select', props<{ stepId: string }>());
export const stepConfig = createAction('Step config', props<{ config: { stepId: string, values: {[key: string]: any } } }>());
export const stepExecStart = createAction('Step exec start', props<{ scenario: ScenarioName, step: string }>());
export const stepExecSuccess = createAction('Step exec success', props<{ scenario: ScenarioName, step: string, newData: RiesgosProduct[] }>());
export const stepExecFailure = createAction('Step exec failure', props<{ scenario: ScenarioName, step: string, error: any }>());

export const altParaPicked = createAction('Parameter for comparison picked', props<{ step: string, para: any }>());