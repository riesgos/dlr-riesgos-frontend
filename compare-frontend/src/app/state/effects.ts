import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { delay, filter, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { BackendService, isExecError } from "../services/backend.service";
import { ConfigService } from "../services/config.service";
import { ResolverService } from "../services/resolver.service";
import * as AppActions from "./actions";
import { convertFrontendDataToApiState, convertApiDataToRiesgosData } from "./helpers";
import { ModalState, Partition, RiesgosState, ScenarioName } from "./state";
import { getRules } from "./rules";


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
                    map(result => {
                        if (isExecError(result)) {
                            // instrumenting results with the action that started the execution
                            return new ExecutionError(JSON.stringify(result.error), action.scenario, action.partition, action.step);
                        }
                        console.log(`Execute success: ${action.scenario}/${action.partition}/${action.step}`);
                        return {action, state: result};
                    })
                );
            })
        );

        const convertedResults$ = executeResults$.pipe(
            map(result => {
                if (isExecutionError(result)) {
                    return AppActions.stepExecFailure({ scenario: result.scenario, partition: result.partition, step: result.step, error: result.initialError });
                } else {
                    const newData = convertApiDataToRiesgosData(result.state.data);
                    return AppActions.stepExecSuccess({ scenario: result.action.scenario, partition: result.action.partition, step: result.action.step, newData });
                }
            })
        );


        return convertedResults$;
    });



    /**
     * AUTO-PILOT (AP)
     * 
                     ┌──────────────┐
               ┌────►│AP Enqueue    │       state: queue ++
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

    private autoPilotFillQueue$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.stepExecSuccess),  // @TODO: or of type: scenario selected
        withLatestFrom(this.store$.select(state => state.riesgos)),
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
        delay(Math.random() * 100),  // in firefox, too many simultaneous posts will be blocked, yielding NS_BINDING_ABORTED.
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
        filter(state => state.autoPilot.queue.length > 0),
        map(state => AppActions.autoPilotDequeue({ scenario: state.scenario, partition: state.partition, step: state.autoPilot.queue[0] }))
    ));



    private openModal$ = createEffect(() => this.actions$.pipe(
        filter(action => action.type === 'Rule-set picked' || action.type === 'Step exec success'),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => {
            const modalData: {scenario: ScenarioName, partition: Partition, modal: ModalState}[] = [];

            const rules = getRules(state.rules);

            for (const [scenario, scenarioData] of Object.entries(state.scenarioData)) {
                for (const [partition, partitionData] of Object.entries(scenarioData)) {
                    const modal = rules.modal(state, scenario as ScenarioName, partition as Partition);
                    if (modal.args) modalData.push({scenario: scenario as ScenarioName, partition: partition as Partition, modal});
                }
            }

            return modalData;
        }),
            
        switchMap(modalData => {
            return modalData.map(m => AppActions.openModal({ 
                scenario: m.scenario, 
                partition: m.partition, 
                args: m.modal.args
            }))
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
        public initialError: string, 
        public scenario: ScenarioName, 
        public partition: Partition, 
        public step: string) {
            super("Error during execution: " + initialError);
        }
}

function isExecutionError(data: any): data is ExecutionError {
    return data.initialError && data.scenario && data.partition && data.step;
}