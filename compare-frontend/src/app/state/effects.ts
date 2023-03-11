import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, createReducer, Store } from "@ngrx/store";
import { forkJoin, of } from "rxjs";
import { catchError, combineLatestWith, filter, map, mergeMap, switchMap, take } from "rxjs/operators";
import { API_Datum, API_DatumReference, API_ScenarioState, BackendService, isApiDatum } from "../services/backend.service";
import { ConfigService } from "../services/config.service";
import { DataService } from "../services/data.service";
import { MapService } from "../services/map.service";
import * as AppActions from "./actions";
import { RiesgosProduct, isRiesgosUnresolvedRefProduct, isRiesgosResolvedRefProduct, RiesgosState, RiesgosStep, StepStateTypes } from "./state";


@Injectable()
export class Effects {

    private loadScenarios$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AppActions.scenarioLoadStart),
            switchMap(() => {
                return this.backendSvc.loadScenarios();
            }),
            map(scenarios => {
                return AppActions.scenarioLoadSuccess({ scenarios });
            })
        );
    });

    private executeStep$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AppActions.stepExecStart),

            // fetch current data, convert, execute, and convert back
            
            mergeMap(action => of(action).pipe(combineLatestWith(
                this.store$.select(state => state.riesgos.scenarioData[action.scenario]?.products).pipe(take(1))
            ))),

            map(([action, products]) => ({
                apiState: convertFrontendDataToApiState(products!),
                action: action
            })),

            mergeMap(({apiState, action}) => of(action).pipe(
                combineLatestWith(this.backendSvc.execute(action.scenario, action.step, apiState))
            )),
            
            map(([action, newApiState]) => ({
                newData: convertApiDataToRiesgosData(newApiState.data), 
                action: action
            })),

            map(({newData, action}) => AppActions.stepExecSuccess({ scenario: action.scenario, step: action.step, newData })),

            catchError((err, caughtObservable) => {
                const errorMessage = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
                return of(AppActions.stepExecFailure({ scenario: err.scenarioId, step: err.stepId, error: errorMessage }));
            })
        )
    });


    // Automatically activate autopilot after selecting EQ paras
    private startAutoPilot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AppActions.stepExecSuccess),
            filter(action => action.scenario === 'PeruShort' && action.step === 'selectEq'),
            map(action => AppActions.startAutoPilot({ scenario: action.scenario }))
        )
    });


    // private autoPilotConfigAfterExec$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(AppActions.stepExecSuccess),
    //         combineLatestWith(this.store$.select(state => state.riesgos)),
    //         filter(([action, state]) => state.useAutoPilot),
    //         map(([action, state]) => state.scenarioData[action.scenario]!),
    //         switchMap(state => {
    //             const newActions: Action[] = [];
    //             const availableSteps = state.steps.filter(step => step.state.type === StepStateTypes.available);
    //             for (const step of availableSteps) {
    //                 // set associated products with their default values
    //             }
    //             return of(newActions);
    //         })
    //     )
    // });

    // private autoPilotExecAfterConfig$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(AppActions.stepConfig),
    //         combineLatestWith(this.store$.select(state => state.riesgos)),
    //         filter(([action, state]) => state.useAutoPilot),
    //     )
    // });

    
    constructor(
        private actions$: Actions,
        private store$: Store<{ riesgos: RiesgosState }>,
        private configSvc: ConfigService,
        private backendSvc: BackendService,
        private dataSvc: DataService,
        private mapSvc: MapService,
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

