import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import * as RiesgosActions from './riesgos.actions';
import { BackendService } from '../services/backend.service';


@Injectable()
export class RiesgosEffects {

  handleExecute$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RiesgosActions.execute),
      concatMap((action) =>
        this.backendService.execute(action.scenario, action.step, action.state).pipe(
          map(newState => RiesgosActions.executeSuccess({ scenario: action.scenario, step: action.step, state: newState })),
          catchError((error: Error) => of(RiesgosActions.executeFailure({ scenario: action.scenario, step: action.step, error: error }))))
      )
    );
  });

  handleGetScenarios$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RiesgosActions.getScenarios),
      concatMap((action) => 
        this.backendService.getScenarios().pipe(
          map(data => RiesgosActions.getScenariosSuccess({ chile: data.chile, ecuador: data.ecuador, peru: data.peru })),
          catchError(error => of(RiesgosActions.getScenariosFailure({ error }))))
      )
    );
  });



  constructor(
    private actions$: Actions,
    private backendService: BackendService
  ) {}
}
