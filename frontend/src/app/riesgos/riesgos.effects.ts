import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as RiesgosActions from './riesgos.actions';
import * as FocusActions from '../focus/focus.actions';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { API_ScenarioInfo, API_ScenarioState, BackendService } from '../services/backend/backend.service';
import { of } from 'rxjs';
import { RiesgosScenarioMetadata, RiesgosScenarioState, RiesgosStep, ScenarioName } from './riesgos.state';
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
    const frontendScenarios: RiesgosScenarioMetadata[] = [];
    for (const apiScenario of apiScenarios) {
        frontendScenarios.push({
            id: apiScenario.id,
            description: apiScenario.description,
            preview: '',
            title: apiScenario.id
        })
    }
    return frontendScenarios;
}

function convertFrontendStateToApiState(state: RiesgosScenarioState): API_ScenarioState {
    const apiState: API_ScenarioState = {
        data: state.products
    };
    return apiState;
}

function convertApiStateToFrontendState(newApiState: API_ScenarioState, scenario: ScenarioName, steps: RiesgosStep[]): RiesgosScenarioState {
    const riesgosState: RiesgosScenarioState = {
        steps: steps,
        products: newApiState.data,
        scenario: scenario
    };
    return riesgosState;
}

