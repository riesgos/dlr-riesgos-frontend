import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as FocusActions from '../focus/focus.actions';
import { API_ScenarioState, BackendService } from '../services/backend/backend.service';
import * as RiesgosActions from './riesgos.actions';
import { getProductsForScenario } from './riesgos.selectors';
import { RiesgosProduct, ScenarioName } from './riesgos.state';


@Injectable()
export class RiesgosEffects {

    appInit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(FocusActions.appInit),
            switchMap(_ => this.backendSvc.loadScenarios()),
            map(scenarios => RiesgosActions.scenariosLoaded({scenarios}))
        );
    });

    runProcess$ = createEffect(() => {
        let memScenario: ScenarioName;
        let memStep: string;

        return this.actions$.pipe(
            ofType(RiesgosActions.executeStart),

            // remember initial state for later
            tap(action => { memScenario = action.scenario; memStep = action.step }),

            // fetch current data, convert, execute, and convert back
            switchMap(_ => this.store$.select(getProductsForScenario(memScenario))),
            map(products => convertFrontendDataToApiState(products)),
            switchMap(apiState => this.backendSvc.execute(memScenario, memStep, apiState)),
            map(newApiState => newApiState.data),
            
            // notify app of new data
            map(newData => RiesgosActions.executeSuccess({ scenario: memScenario, step: memStep, newData })),
            catchError(e => of(RiesgosActions.executeError({ scenario: memScenario, step: memStep, error: e })))
        );
    });

    constructor(
        private store$: Store,
        private actions$: Actions,
        private backendSvc: BackendService
    ) {}

}




function convertFrontendDataToApiState(products: RiesgosProduct[]): API_ScenarioState {
    const apiState: API_ScenarioState = {
        // @ts-ignore
        data: products
    };
    return apiState;
}


