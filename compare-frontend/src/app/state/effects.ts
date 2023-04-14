import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { forkJoin, of } from "rxjs";
import { catchError, delay, filter, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { BackendService } from "../services/backend.service";
import { ConfigService } from "../services/config.service";
import { ResolverService } from "../services/resolver.service";
import * as AppActions from "./actions";
import { convertFrontendDataToApiState, convertApiDataToRiesgosData, getMapPositionForStep } from "./helpers";
import { Partition, RiesgosState, ScenarioName } from "./state";


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

    /**
     * 
     *  state$ ───┐
     *            └─►
     *            ┌─► apiState$ ────► executeResults$ ────► convertedResults$ ────► success$ ───► caught$
     *            │
     *  action$───┘
     */
    private executeStep$ = createEffect(() => {

        const action$ = this.actions$.pipe(
            ofType(AppActions.stepExecStart),
            tap(action => console.log(`Execute start: ${action.scenario}/${action.partition}/${action.step}`))
        );

        const state$ = this.store$.select(state => state.riesgos);

        const apiState$ = action$.pipe(
            withLatestFrom(state$),
            map(([action, state]) => {
                const scenarioData = state.scenarioData[action.scenario]!;
                const partitionData = scenarioData[action.partition]!;
                const products = partitionData.products;
                const apiState = convertFrontendDataToApiState(products);
                return {action, apiState};
            })
        );

        const executeResults$ = apiState$.pipe(
            
            // must be *merge*-map for multiple requests in parallel to not interfer with one another
            mergeMap(({action, apiState}) => {                        
                return this.backendSvc.execute(action.scenario, action.step, apiState).pipe(

                    // instrumenting results with the action that started the execution
                    map(apiScenarioState => ({ action, apiScenarioState })),

                    tap(({action}) => console.log(`Execute success: ${action.scenario}/${action.partition}/${action.step}`)),

                    // instrumenting potential errors with the action that started the execution
                    catchError((err, caught) => {
                        throw new ExecutionError(err, action.scenario, action.partition, action.step);
                    })

                    // NOTE: instrumenting this pipe with an action that is only used far down the line seems inelegant. 
                    // Maybe add the action to a zone instead?
                );
            })
        );

        const convertedResults$ = executeResults$.pipe(map(({action, apiScenarioState}) => ({
            newData: convertApiDataToRiesgosData(apiScenarioState.data),
            action: action
        })));

        const successAction$ = convertedResults$.pipe(map(({newData, action}) => AppActions.stepExecSuccess({ scenario: action.scenario, partition: action.partition, step: action.step, newData })));

        const caughtAction$ = successAction$.pipe(
            catchError((err: ExecutionError, caught) => {
                return of(AppActions.stepExecFailure({ scenario: err.scenario, partition: err.partition, step: err.step, error: err.initialError }));
            })
        );

        return caughtAction$;
    });



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
        map(action => AppActions.autoPilotStart({ scenario: action.scenario, partition: action.partition }))
    ));

    private updateAutoPilotOnStart$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.autoPilotStart),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        filter(([action, state]) => {
            const scenarioData = state.scenarioData[action.scenario]!;
            const partitionData = scenarioData[action.partition]!;
            return partitionData.autoPilot.useAutoPilot;
        }),
        map(([action, state]) => AppActions.autoPilotEnqueue({ scenario: action.scenario, partition: action.partition }))
    ));

    private dequeueAutoPilotAfterUpdate$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.autoPilotEnqueue),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => state.scenarioData[action.scenario]![action.partition]!),
        filter(state => state.autoPilot.queue.length > 0),
        map(state => AppActions.autoPilotDequeue({scenario: state.scenario, partition: state.partition, step: state.autoPilot.queue[0] }))
    ));

    private execDequeued$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.autoPilotDequeue),
        delay(Math.random() * 100),  // in firefox, too many simultaneous posts will be blocked.
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
        map(action => AppActions.autoPilotEnqueue({ scenario: action.scenario, partition: action.partition }))
    ));





    private focusMapOnCurrentStep$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepSetFocus),
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
        private dataSvc: ResolverService,
    ) {}
}


class ExecutionError extends Error {
    constructor(
        public initialError: Error, 
        public scenario: ScenarioName, 
        public partition: Partition, 
        public step: string) {
            super("Error during execution: " + initialError.message);
        }
}