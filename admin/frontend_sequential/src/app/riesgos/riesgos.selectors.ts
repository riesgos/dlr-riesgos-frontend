import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRiesgos from './riesgos.reducer';

export const selectRiesgosState = createFeatureSelector<fromRiesgos.RiesgosState>(
  fromRiesgos.riesgosFeatureKey
);
