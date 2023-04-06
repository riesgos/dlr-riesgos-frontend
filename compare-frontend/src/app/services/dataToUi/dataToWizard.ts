import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, OperatorFunction, filter, map } from "rxjs";
import { Partition, RiesgosProduct, RiesgosScenarioState, RiesgosState, RiesgosStep, ScenarioName } from "src/app/state/state";
import * as AppActions from 'src/app/state/actions';


export interface StepData {
    step: RiesgosStep,
    inputs: RiesgosProduct[],
    outputs: RiesgosProduct[]
}

@Injectable({
    providedIn: 'root'
})
export class WizardService {

    constructor(
        private store: Store<{ riesgos: RiesgosState }>
    ) {}


    public getStepData(scenario: ScenarioName, partition: Partition): Observable<StepData[]> {

        const scenarioState$ = this.store.select(state => {
            const scenarioStates = state.riesgos.scenarioData[scenario];
            if (!scenarioStates) return undefined;
            const scenarioState = scenarioStates[partition];
            return scenarioState;
        }).pipe(
            filter(v => v !== undefined) as OperatorFunction<RiesgosScenarioState | undefined, RiesgosScenarioState>,
        );
        
        const stepData$ = scenarioState$.pipe(
            map(scenarioState => {
                const out: StepData[] = [];
                for (const step of scenarioState.steps) {
                    const inputIds = step.step.inputs.map(i => i.id);
                    const inputs = scenarioState.products.filter(p => inputIds.includes(p.id));
                    const outputIds = step.step.outputs.map(i => i.id);
                    const outputs = scenarioState.products.filter(p => outputIds.includes(p.id));
                    out.push({ step, inputs, outputs });
                }
                return out;
            })
        );

        return stepData$;
    }

    public getFocussedStep(scenario: ScenarioName, partition: Partition): Observable<string> {
        return this.store.select(state => {
            const riesgosState = state.riesgos;
            const focussedStep = riesgosState.focusState.focusedStep;
            return focussedStep;
        });
    }

    public toggleFocus(scenario: ScenarioName, partition: Partition) {
        this.store.dispatch(AppActions.toggleFocus({ scenario, partition }));
    }

    public stepSelect(scenario: ScenarioName, partition: Partition, stepId: string) {
        this.store.dispatch(AppActions.stepSelect({ scenario, partition, stepId }));
    }
}