import { createAction, props } from '@ngrx/store';
import { ScenarioState } from './riesgos.reducer';


export const getScenarios = createAction(
  '[Riesgos] get scenarios'
);

export const getScenariosSuccess = createAction(
  '[Riesgos] get scenarios success',
  props<{
    chile: ScenarioState,
    ecuador: ScenarioState,
    peru: ScenarioState
  }>()
);

export const getScenariosFailure = createAction(
  '[Riesgos] get scenarios failure',
  props<{error: Error}>()
);

export const execute = createAction(
  '[Riesgos] execute',
  props<{
    scenario: 'chile' | 'ecuador' | 'peru',
    step: string,
    state: ScenarioState
  }>()
);

export const executeSuccess = createAction(
  '[Riesgos] execute success',
  props<{
    scenario: 'chile' | 'ecuador' | 'peru',
    step: string,
    state: ScenarioState
  }>()
);

export const executeFailure = createAction(
  '[Riesgos] execute failure',
  props<{
    scenario: 'chile' | 'ecuador' | 'peru',
    step: string,
    error: Error
  }>()
);
