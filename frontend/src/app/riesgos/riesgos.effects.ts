import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as RiesgosActions from './riesgos.actions';
import * as FocusActions from '../focus/focus.actions';
import * as InteractionActions from '../interactions/interactions.actions';
import { catchError, map, switchMap } from 'rxjs/operators';

import { BackendService } from '../services/backend/backend.service';
import { of } from 'rxjs';




@Injectable()
export class RiesgosEffects {

    appInit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(FocusActions.appInit),
            switchMap(_ => this.backendSvc.loadScenarios()),
            map(results => RiesgosActions.metadataProvided(results))
        );
    });

    runProcess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RiesgosActions.executeStart),
            switchMap(action => this.backendSvc.execute(action.scenario, action.step, action.state)),
            map(results => RiesgosActions.executeSuccess(results)),
            catchError(e => of(RiesgosActions.executeError(e)))
        );
    });

    constructor(
        private actions$: Actions,
        private backendSvc: BackendService
    ) {}

}
