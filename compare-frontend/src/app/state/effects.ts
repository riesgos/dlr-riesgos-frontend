import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { delay, filter, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { BackendService, isExecError } from "../services/backend.service";
import { ConfigService } from "../services/config.service";
import { ResolverService } from "../services/resolver.service";
import * as AppActions from "./actions";
import { convertFrontendDataToApiState, convertApiDataToRiesgosData } from "./helpers";
import { ModalState, PartitionName, RiesgosState, ScenarioName, StepStateTypes } from "./state";
import { getRules } from "./rules";
import { combineLatest, firstValueFrom, forkJoin, merge, of } from "rxjs";


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
        switchMap(([action, state]) => {
            const actions: Action[] = [];

            const rules = getRules(state.rules);

            for (const [scenario, scenarioData] of Object.entries(state.scenarioData)) {
                for (const [partition, partitionData] of Object.entries(scenarioData)) {
                    const modal = rules.modal(state, scenario as ScenarioName, partition as PartitionName);
                    if (modal.args) {  // There should be a modal ...
                        actions.push(AppActions.openModal({scenario: scenario as ScenarioName, partition: partition as PartitionName, args: modal.args }));
                    } else { // There should not be one ...
                        if (partitionData.modal.args) { // ... but there is one:
                            actions.push(AppActions.closeModal({scenario: scenario as ScenarioName, partition: partition as PartitionName}));
                        }
                    }
                }
            }

            return actions;
        })  
    ));


    private linkingMapViews$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.setLinkMapViews),
        filter(a => a.linkMapViews === true),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => {
            const currentScenario = state.currentScenario;
            const scenarioData = state.scenarioData[currentScenario as ScenarioName]!.left!;
            const center = scenarioData.map.center;
            const zoom = scenarioData.map.zoom;
            return AppActions.mapMove({partition: 'left', scenario: state.currentScenario as ScenarioName, center, zoom });
        })
    ));

    // this action ensures that there is a map click on the right, causing a re-render, which we need for filtering the available eqs.
    private modalClosed$ = createEffect(() => this.actions$.pipe(
        ofType(AppActions.closeModal),
        withLatestFrom(this.store$.select(state => state.riesgos)),
        map(([action, state]) => {
            const currentScenario = state.currentScenario;
            const scenarioData = state.scenarioData[currentScenario as ScenarioName]!.left!;
            const location = scenarioData.map.clickLocation;
            return AppActions.mapClick({ scenario: action.scenario, partition: action.partition, location });
        })
    ));


    // /**
    //  * Ugly hack: if left eq is selected, we remove it from the options for eqs on the right
    //  */
    // private leftEqSelected$ = createEffect(() => this.actions$.pipe(
    //     ofType(AppActions.stepExecSuccess),
    //     filter(action => action.scenario === "PeruShort" && action.partition === "left" && action.step === "selectEq"),
    //     withLatestFrom(this.store$.select(state => state.riesgos)),
    //     filter(([action, state]) => {
    //         const rightScenarioData = state.scenarioData.PeruShort?.right;
    //         if (state.currentScenario !== "PeruShort" || !rightScenarioData) return false;
    //         const rightEqSelectedStep = rightScenarioData.steps.find(s => s.step.id === "selectEq");
    //         return rightEqSelectedStep?.state.type === StepStateTypes.available;
    //     }),
    //     switchMap(async ([action, state]) => {
    //         const resolvedData = await firstValueFrom(this.resolver.resolveReference(action.newData.find(d => d.id === "selectedEq")!));
    //         const pickedFeatureLeft = resolvedData.value.features[0].id;

    //         const rightScenarioData = state.scenarioData.PeruShort!.right!;
    //         const rightEqSelectedStep = rightScenarioData.steps.find(s => s.step.id === "selectEq")!;
    //         const apiData = structuredClone(rightEqSelectedStep.step);
    //         apiData.inputs[0].options = apiData.inputs[0].options!.filter((o: any) => o.id !== pickedFeatureLeft);

    //         return AppActions.stepChange({ scenario: "PeruShort", partition: "right", stepId: "selectedEq", newData: apiData });
    //     })
    // ));


    
    constructor(
        private actions$: Actions,
        private store$: Store<{ riesgos: RiesgosState }>,
        private configSvc: ConfigService,
        private backendSvc: BackendService,
        private resolver: ResolverService,
    ) {}
}


class ExecutionError extends Error {
    constructor(
        public initialError: string, 
        public scenario: ScenarioName, 
        public partition: PartitionName, 
        public step: string) {
            super("Error during execution: " + initialError);
        }
}

function isExecutionError(data: any): data is ExecutionError {
    return data.initialError && data.scenario && data.partition && data.step;
}