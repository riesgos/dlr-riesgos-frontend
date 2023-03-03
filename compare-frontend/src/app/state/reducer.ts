import { createReducer, on } from '@ngrx/store';
import { RiesgosState, initialRiesgosState } from './state';
import { scenarioLoadStart, scenarioLoadSuccess, scenarioLoadFailure, stepSelect, stepConfig, stepExecStart, stepExecSuccess, stepExecFailure, altParaPicked } from './actions';



export const reducer = createReducer(
  initialRiesgosState,
  on(scenarioLoadStart, (state, action) => {
    return state;
  }),

  on(scenarioLoadSuccess, (state, action) => {
    return state;
  }),

  on(scenarioLoadFailure, (state, action) => {
    return state;
  }),

  on(stepSelect, (state, action) => {
    return state;
  }),

  on(stepConfig, (state, action) => {
    return state;
  }),

  on(stepExecStart, (state, action) => {
    return state;
  }),

  on(stepExecSuccess, (state, action) => {
    return state;
  }),

  on(stepExecFailure, (state, action) => {
    return state;
  }),

  on(altParaPicked, (state, action) => {
    return state;
  }),

);