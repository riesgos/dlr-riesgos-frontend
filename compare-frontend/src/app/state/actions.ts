import { createAction, props } from '@ngrx/store';
import { API_ScenarioInfo } from '../services/backend.service';


export const scenarioLoadStart = createAction('Scenario load start');
export const scenarioLoadSuccess = createAction('Scenario load success', props<{ scenarios: API_ScenarioInfo[] }>());
export const scenarioLoadFailure = createAction('Scenario load failure', props<{ error: any }>());
export const scenarioPicked = createAction('Scenario picked', props<{ scenario: string }>());
export const modePicked = createAction('Mode picked', props<{ mode: string }>());

export const stepSelect = createAction('Step select', props<{ step: string }>());
export const stepConfig = createAction('Step config', props<{ config: any }>());
export const stepExecStart = createAction('Step exec start', props<{ step: string }>());
export const stepExecSuccess = createAction('Step exec success', props<{ newState: any }>());
export const stepExecFailure = createAction('Step exec failure', props<{ error: any }>());

export const altParaPicked = createAction('Parameter for comparison picked', props<{ step: string, para: any }>());