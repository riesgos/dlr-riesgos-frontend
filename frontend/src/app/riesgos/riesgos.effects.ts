import { combineLatest, forkJoin, of } from 'rxjs';
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

        // https://medium.com/@snorredanielsen/rxjs-accessing-a-previous-value-further-down-the-pipe-chain-b881026701c1
        // https://blog.angular-university.io/rxjs-error-handling/

        return this.actions$.pipe(
            ofType(RiesgosActions.executeStart),

            // fetch current data, convert, execute, and convert back
            
            mergeMap(action => { return combineLatest([
                this.store$.select(getProductsForScenario(action.scenario)).pipe(take(1)),
                of(action)
            ]); }),

            map(([products, action]) => ({
                apiState: convertFrontendDataToApiState(products),
                action: action
            })),

            mergeMap(({apiState, action}) => { return combineLatest([
                    this.backendSvc.execute(action.scenario, action.step, apiState),
                    of(action)
            ]); }),

            map(([newApiState, action]) => ({
                newData: convertApiDataToRiesgosData(newApiState.data), 
                action: action
            })),

            map(({newData, action}) => RiesgosActions.executeSuccess({ scenario: action.scenario, step: action.step, newData })),

            catchError((e, c) => {
                return c.pipe( map(v => {
                        return RiesgosActions.executeError({ scenario: v.scenario, step: v.step, error: typeof e === 'string' ? JSON.parse(e) : e })   
                }) );
            })
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
