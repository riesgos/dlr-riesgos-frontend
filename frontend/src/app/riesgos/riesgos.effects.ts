import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as RiesgosActions from './riesgos.actions';
import * as FocusActions from '../focus/focus.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { API_ScenarioInfo, API_ScenarioState, BackendService } from '../services/backend/backend.service';
import { of } from 'rxjs';
import { RiesgosProduct, RiesgosScenarioMetadata, ScenarioName } from './riesgos.state';
import { Store } from '@ngrx/store';
import { getProducts, getProductsForScenario } from './riesgos.selectors';



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


