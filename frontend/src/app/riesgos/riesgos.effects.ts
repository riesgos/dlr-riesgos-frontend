import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as FocusActions from '../focus/focus.actions';
import { API_Datum, API_DatumReference, API_ScenarioState, BackendService, isApiDatum } from '../services/backend/backend.service';
import * as RiesgosActions from './riesgos.actions';
import { getProductsForScenario } from './riesgos.selectors';
import { isRiesgosValueProduct, isRiesgosUnresolvedRefProduct, isRiesgosResolvedRefProduct, RiesgosProduct, ScenarioName } from './riesgos.state';


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
            mergeMap(_ => this.store$.select(getProductsForScenario(memScenario)).pipe(take(1))),
            map(products => convertFrontendDataToApiState(products)),
            mergeMap(apiState => this.backendSvc.execute(memScenario, memStep, apiState)),
            map(newApiState => convertApiDataToRiesgosData(newApiState.data)),
            
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
    const data: (API_Datum | API_DatumReference)[] = [];
    for (const product of products) {

        const datum: any = {
            id: product.id
        };

        if (product.options) {
            datum.options = product.options;
        }

        if (isRiesgosUnresolvedRefProduct(product) || isRiesgosResolvedRefProduct(product)) {
            datum.reference = product.reference;
        } 
        
        else if (product.value) {
            datum.value = product.value;
        }

        data.push(datum);
    }
    const apiState: API_ScenarioState = {
        data
    };
    return apiState;
}

function convertApiDataToRiesgosData(apiData: (API_Datum | API_DatumReference)[]): RiesgosProduct[] {
    
    const riesgosData: RiesgosProduct[] = [];

    for (const apiProduct of apiData) {
        
        const prod: RiesgosProduct = {
            id: apiProduct.id
        };

        if ((apiProduct as any).options) {
            prod.options = (apiProduct as any).options;
        }

        if (isApiDatum(apiProduct)) {
            prod.value = apiProduct.value;
        } 
        
        else {
            prod.reference = apiProduct.reference;
        }

        riesgosData.push(prod);
    }
    return riesgosData;
}
