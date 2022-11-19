import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as RiesgosActions from './riesgos.actions';
import * as FocusActions from '../focus/focus.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { API_ScenarioInfo, API_ScenarioState, BackendService } from '../services/backend/backend.service';
import { of } from 'rxjs';
import { RiesgosProduct, RiesgosScenarioMetadata, ScenarioName } from './riesgos.state';



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
        let memScenario: ScenarioName;
        let memStep: string;

        return this.actions$.pipe(
            ofType(RiesgosActions.executeStart),

            // remember initial state for later
            tap(action => { memScenario = action.scenario; memStep = action.step }),

            // convert, execute, and convert back
            map(action => ({ scenario: action.scenario, step: action.step, state: convertFrontendDataToApiState(action.data)})),
            switchMap(d => this.backendSvc.execute(d.scenario, d.step, d.state)),
            map(newApiState => newApiState.data),
            
            // notify app of new data
            map(newData => RiesgosActions.executeSuccess({ scenario: memScenario, step: memStep, newData })),
            catchError(e => of(RiesgosActions.executeError({ scenario: memScenario, step: memStep, error: e })))
        );
    });

    constructor(
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

function convertFrontendDataToApiState(products: RiesgosProduct[]): API_ScenarioState {
    const apiState: API_ScenarioState = {
        data: products
    };
    return apiState;
}


