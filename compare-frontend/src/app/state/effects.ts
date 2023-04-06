import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { TypedAction } from "@ngrx/store/src/models";
import { Observable } from "ol";
import { forkJoin, ObservableInput, of } from "rxjs";
import { catchError, delay, filter, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { getMapPositionForStep } from "../services/dataToUi/dataToMap";
import { BackendService } from "../services/backend.service";
import { ConfigService } from "../services/config.service";
import { DataService } from "../services/data.service";
import * as AppActions from "./actions";
import { stepExecFailure } from "./actions";
import { convertFrontendDataToApiState, convertApiDataToRiesgosData } from "./helpers";
import { RiesgosState } from "./state";


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

    private executeStep$ = createEffect(() => 
        { return this.actions$.pipe(
        ofType(AppActions.stepExecStart),
        tap(action => console.log(`Execute start: ${action.partition}/${action.step}`)),

        // fetch current data, convert, execute, and convert back

        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => {
            return {
                action: action,
                products: state.scenarioData[action.scenario]![action.partition]!.products
            }
        }),

        map(({action, products}) => ({
            apiState: convertFrontendDataToApiState(products),
            action: action
        })),

        mergeMap(({apiState, action}) => {  // must be merge map for multiple requests in parallel
            return forkJoin([of(action), this.backendSvc.execute(action.scenario, action.step, apiState)])
        }),

        map(([action, newApiState]) => ({
            newData: convertApiDataToRiesgosData(newApiState.data), 
            action: action
        })),

        tap(({newData, action}) => console.log(`Execute success: ${action.partition}/${action.step}`)),
        map(({newData, action}) => AppActions.stepExecSuccess({ scenario: action.scenario, partition: action.partition, step: action.step, newData })),

        // catchError<any, any>((err, caught) => {
        //     const errorMessage = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
        //     return of(AppActions.stepExecFailure({ scenario: err.scenarioId, partition: err.partition,  step: err.stepId, error: errorMessage }));
        // })

        )}
    );




    /**
     * AUTO-PILOT (AP)
     * 
                     ┌──────────────┐
                     │AP Start      │
                     └───────┬──────┘
                             │
                     ┌───────▼──────┐
               ┌────►│AP Update     │       state: queue ++
               │     └───────┬──────┘
               │             │
               │     ┌───────▼──────┐       state: queue --
               │     │AP Dequeue    ◄───┐
               │     └───────┬──────┘   │
               │             │          │  Run all queued up
               │     ┌───────▼──────┐   │  steps in parallel
               │     │execStart     ├───┘
               │     └───────┬──────┘
               │             │
               │     ┌───────▼──────┐
   Once done,  │     │execSuccess   │
check if more  │     └───────┬──────┘
 steps to run  │             │
               └─────────────┘

     * 
     */

    // Automatically activate autopilot after selecting EQ paras
    private startAutoPilot$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepExecSuccess),
        filter(action => action.scenario === 'PeruShort' && action.step === 'selectEq'),
        map(action => AppActions.startAutoPilot({ scenario: action.scenario, partition: action.partition }))
    ));

    private updateAutoPilotOnStart$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.startAutoPilot),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        filter(([action, state]) => state.scenarioData[action.scenario]![action.partition].autoPilot.useAutoPilot),
        map(([action, state]) => AppActions.updateAutoPilot({ scenario: action.scenario, partition: action.partition }))
    ));

    private dequeueAutoPilotAfterUpdate$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.updateAutoPilot),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => state.scenarioData[action.scenario]![action.partition]!),
        filter(state => state.autoPilot.queue.length > 0),
        map(state => AppActions.autoPilotDequeue({scenario: state.scenario, partition: state.partition, step: state.autoPilot.queue[0] }))
    ));

    private execDequeued$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.autoPilotDequeue),
        delay(Math.random() * 100),  // in firefox, too many simultaneous posts are being blocked.
        map(action => AppActions.stepExecStart({
            scenario: action.scenario,
            partition: action.partition,
            step: action.step
        }))
    ));

    private dequeueMoreAfterExecStart$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepExecStart),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => state.scenarioData[action.scenario]![action.partition]!),
        filter(state => state.autoPilot.useAutoPilot && state.autoPilot.queue.length > 0),
        map(state => AppActions.autoPilotDequeue({ scenario: state.scenario, partition: state.partition, step: state.autoPilot.queue[0] }))
    ));

    private updateAutoPilotOnSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepExecSuccess),
        filter(action => action.scenario !== 'PeruShort' || action.step !== 'selectEq'),  // except if this is the AP-start-condition - because that's already been called.
        map(action => AppActions.updateAutoPilot({ scenario: action.scenario, partition: action.partition }))
    ));





    private focusMapOnCurrentStep$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepSelect),
        map(action => {
            const {center, zoom} = getMapPositionForStep(action.scenario, action.partition, action.stepId);
            return AppActions.mapMove({ scenario: action.scenario, partition: action.partition, zoom, center });
        })
    ));

    
    constructor(
        private actions$: Actions,
        private store$: Store<{ riesgos: RiesgosState }>,
        private configSvc: ConfigService,
        private backendSvc: BackendService,
        private dataSvc: DataService,
    ) {}
}

