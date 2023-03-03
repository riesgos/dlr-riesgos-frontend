import { createReducer, on } from '@ngrx/store';
import { RiesgosState, initialRiesgosState } from './state';
import { scenarioLoadStart, scenarioLoadSuccess, scenarioLoadFailure, stepSelect, stepConfig, stepExecStart, stepExecSuccess, stepExecFailure, altParaPicked } from './actions';



export const reducer = createReducer(
  initialRiesgosState,
  on(scenarioLoadStart, (state, action) => {

  }),

  on(scenarioLoadSuccess, (state, action) => {

  }),

  on(scenarioLoadFailure, (state, action) => {

  }),

  on(stepSelect, (state, action) => {

  }),

  on(stepConfig, (state, action) => {

  }),

  on(stepExecStart, (state, action) => {

  }),

  on(stepExecSuccess, (state, action) => {

  }),

  on(stepExecFailure, (state, action) => {

  }),

  on(altParaPicked, (state, action) => {

  }),

);