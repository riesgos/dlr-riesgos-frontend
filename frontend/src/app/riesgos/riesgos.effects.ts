import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as RiesgosActions from './riesgos.actions';
import * as FocusActions from '../focus/focus.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { API_ScenarioInfo, API_ScenarioState, BackendService } from '../services/backend/backend.service';
import { of } from 'rxjs';
import { RiesgosScenarioMetadata, RiesgosScenarioState } from './riesgos.state';
import { Store } from '@ngrx/store';
import { getCurrentScenarioRiesgosState, getScenario, getScenarioRiesgosState } from './riesgos.selectors';




@Injectable()
export class RiesgosEffects {

    appInit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(FocusActions.appInit),
            switchMap(_ => this.backendSvc.loadScenarios()),
            map(apiScenarios => convertApiScenariosToFrontendScenarios(apiScenarios)),
            map(scenarios => RiesgosActions.scenariosLoaded({scenarios}))
        );
    });

    runProcess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RiesgosActions.executeStart),
            withLatestFrom(
                this.store.select(getScenario),
                this.store.select(getCurrentScenarioRiesgosState)
            ),
            map(([action, scenario, state]) => ({ scenario: scenario, step: action.step, state: convertFrontendStateToApiState(state)})),
            switchMap(d => this.backendSvc.execute(d.scenario, d.step, d.state)),
            map(newApiState => convertApiStateToFrontendState(newApiState)),
            map(newState => RiesgosActions.executeSuccess({newState})),
            catchError(e => of(RiesgosActions.executeError(e)))
        );
    });

    constructor(
        private store: Store,
        private actions$: Actions,
        private backendSvc: BackendService
    ) {}

}


function convertApiScenariosToFrontendScenarios(apiScenarios: API_ScenarioInfo[]): RiesgosScenarioMetadata[] {
    throw new Error('Function not implemented.');
}

function convertFrontendStateToApiState(state: RiesgosScenarioState): API_ScenarioState {
    throw new Error('Function not implemented.');
}

function convertApiStateToFrontendState(newApiState: API_ScenarioState): RiesgosScenarioState {
    throw new Error('Function not implemented.');
}

