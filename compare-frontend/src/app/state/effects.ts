import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { forkJoin, of } from "rxjs";
import { catchError, combineLatestWith, filter, map, mergeMap, switchMap, take, tap, withLatestFrom } from "rxjs/operators";
import { BackendService } from "../services/backend.service";
import { ConfigService } from "../services/config.service";
import { DataService } from "../services/data.service";
import { MapService } from "../services/map.service";
import * as AppActions from "./actions";
import { convertFrontendDataToApiState, convertApiDataToRiesgosData, allParasSet, fillWithDefaults } from "./helpers";
import { RiesgosState, StepStateTypes } from "./state";


@Injectable()
export class Effects {

    private loadScenarios$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.scenarioLoadStart),
        switchMap(() => {
            return this.backendSvc.loadScenarios();
        }),
        map(scenarios => {
            return AppActions.scenarioLoadSuccess({ scenarios });
        })
    ));

    private executeStep$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepExecStart),
        tap(action => console.log(`Execute start: ${action.step}`)),
            
        // fetch current data, convert, execute, and convert back

        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => {
            return {
                action: action,
                products: state.scenarioData[action.scenario]!.products
            }
        }),

        map(({action, products}) => ({
            apiState: convertFrontendDataToApiState(products),
            action: action
        })),

        switchMap(({apiState, action}) => {
            return forkJoin([of(action), this.backendSvc.execute(action.scenario, action.step, apiState)])
        }),

        map(([action, newApiState]) => ({
            newData: convertApiDataToRiesgosData(newApiState.data), 
            action: action
        })),

        tap(({newData, action}) => console.log(`Execute success: ${action.step}`)),
        map(({newData, action}) => AppActions.stepExecSuccess({ scenario: action.scenario, step: action.step, newData })),

        // catchError((error) => {
        //     const errorMessage = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
        //     return AppActions.stepExecFailure({ scenario: err.scenarioId, step: err.stepId, error: errorMessage });
        // })

    ));


    // Automatically activate autopilot after selecting EQ paras
    private startAutoPilot$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepExecSuccess),
        filter(action => action.scenario === 'PeruShort' && action.step === 'selectEq'),
        map(action => AppActions.startAutoPilot({ scenario: action.scenario })),
    ));

    private dequeueAutoPilotFirst$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.startAutoPilot),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => state.scenarioData[action.scenario]!),
        filter(state => state.autoPilot.queue.length > 0),
        tap(state => console.log(`dequeue after start-auto-pilot: ${state.autoPilot.queue}`)),
        map(state => AppActions.autoPilotDequeue({
                scenario: state.scenario,
                step: state.autoPilot.queue[0]
        }))
    ));

    private dequeueAutoPilotSubsequent$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepExecStart),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        filter(([action, state]) => state.scenarioData[action.scenario]!.autoPilot.useAutoPilot),
        tap(([action, state]) => console.log(`dequeue after exec-start ${action.step}: ${state.scenarioData[action.scenario]!.autoPilot.queue}`)),
        map(([action, state]) => state.scenarioData[action.scenario]!),
        filter(state => state.autoPilot.queue.length > 0),
        map(state => AppActions.autoPilotDequeue({
            scenario: state.scenario,
            step: state.autoPilot.queue[0]
        }))
    ));

    private execDequeued$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.autoPilotDequeue),
        map(action => AppActions.stepExecStart({
            scenario: action.scenario,
            step: action.step
        }))
    ));
    
    constructor(
        private actions$: Actions,
        private store$: Store<{ riesgos: RiesgosState }>,
        private configSvc: ConfigService,
        private backendSvc: BackendService,
        private dataSvc: DataService,
        private mapSvc: MapService,
    ) {}
}

