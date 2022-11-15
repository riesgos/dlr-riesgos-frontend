import { Action, createReducer, on } from '@ngrx/store';
import * as RiesgosActions from './riesgos.actions';

export const riesgosFeatureKey = 'riesgos';

export interface Datum {
  id: string,
  value: any
};

export interface DatumReference {
  id: string,
  reference: string
}

export interface ScenarioState {
  data: (Datum | DatumReference)[]
}

export interface RiesgosState {
  peru: ScenarioState,
  chile: ScenarioState,
  ecuador: ScenarioState,
  activeScenario: null | 'peru' | 'chile' | 'ecuador'
}

export const initialState: RiesgosState = {
  peru: { data: [] },
  chile: { data: [] },
  ecuador: { data: [] },
  activeScenario: null
};

export const reducer = createReducer(
  initialState,

  on(RiesgosActions.execute, state => state),
  on(RiesgosActions.executeSuccess, (state, action) => {
    return {
      ... state,
      [action.scenario]: action.state
    };
  }),
  // @TODO: do something on failure
  on(RiesgosActions.executeFailure, (state, action) => state),
  on(RiesgosActions.getScenarios, state => state),
  on(RiesgosActions.getScenariosSuccess, (state, action) => {
    return {
      ... state,
      chile: action.chile,
      peru: action.peru,
      ecuador: action.ecuador
    };
  }),
  // @TODO: do something on failure
  on(RiesgosActions.getScenariosFailure, state => state)
);
