import { bufferCount, combineLatest, filter, map, Observable, of, OperatorFunction, scan, switchMap } from 'rxjs';
import { ResolverService } from 'src/app/services/resolver.service';
import * as AppActions from 'src/app/state/actions';
import { allProductsEqual, maybeArraysEqual } from 'src/app/state/helpers';
import { Partition, RiesgosScenarioState, RiesgosState, RiesgosStep, ScenarioName } from 'src/app/state/state';
import { Injectable, Type } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConverterService } from './converter.service';

export interface WizardComposite {
    step: RiesgosStep,
    info?: () => { component: Type<any>, args: {[key: string]: any} },
    legend?: () => { component: Type<any>, args: {[key: string]: any} },
    inputs: {
        formtype: 'string' | 'string-select',
        options?: { [key: string]: any },
        currentValue?: any,
        label: string,
    }[],
    hasFocus: boolean
}

export interface WizardState {
    stepData: WizardComposite[],
}

@Injectable()
export class WizardService {

    constructor(
        private store: Store<{ riesgos: RiesgosState }>,
        private resolver: ResolverService,
        private converterSvc: ConverterService
    ) {}


    /**
     *  state$ ──────► changedState$ ─────► resolvedData$ ─────┐
     *                             │                           │
     *                             │                           ▼
     *                             └────────────────────────► wizardState$
     */
    public getWizardState(scenario: ScenarioName, partition: Partition): Observable<WizardState> {

        const scenarioState$ = this.store.select(state => {
            const scenarioStates = state.riesgos.scenarioData[scenario];
            if (!scenarioStates) return undefined;
            const scenarioState = scenarioStates[partition];
            return scenarioState;
        }).pipe(
            filter(v => v !== undefined) as OperatorFunction<RiesgosScenarioState | undefined, RiesgosScenarioState>,
        );

        const changedState$ = scenarioState$.pipe(
            scan((acc: (RiesgosScenarioState | undefined)[], cur: RiesgosScenarioState) => [acc[1], cur], [undefined, undefined]),
            filter(([last, current]) => {
                if (current === undefined) return false;
                if (last === undefined) return true;
                if (!current.active) return false;
                if (!maybeArraysEqual(last.focus.focusedSteps, current.focus.focusedSteps)) return true;
                if (!allProductsEqual(last.products, current.products)) return true;
                if (!maybeArraysEqual(last.map.clickLocation!, current.map.clickLocation!)) return true;
                return false;
            }) as OperatorFunction<(RiesgosScenarioState | undefined)[], RiesgosScenarioState[]>,
            map(([_, current]) => current)
        );

        const resolvedData$ = changedState$.pipe(switchMap(state => {
            const currentSteps = state.steps.filter(s => state.focus.focusedSteps.includes(s.step.id));
            if (currentSteps.length === 0) return of([]);

            const outputIds = currentSteps.map(s => s.step.outputs.map(o => o.id)).flat();
            const outputProducts = state.products.filter(p => outputIds.includes(p.id)).filter(p => p.value || p.reference);
            return this.resolver.resolveReferences(outputProducts);
        }));

        const wizardState$ = combineLatest([changedState$, resolvedData$]).pipe(map(([scenarioState, resolvedData]) => {
            const steps: WizardComposite[] = [];
            for (const step of scenarioState.steps) {
                let stepData: WizardComposite;
                if (scenarioState.focus.focusedSteps.includes(step.step.id)) {
                    const converter = this.converterSvc.getConverter(scenario, step.step.id);
                    stepData = converter.getInfo(scenarioState, resolvedData);
                    stepData.hasFocus = true;
                } else {
                    stepData = {
                        hasFocus: false,
                        step: step,
                        inputs: []
                    }
                }
                steps.push(stepData);
            }
            return { stepData: steps };
        }));

        return wizardState$;
    }

    public toggleFocus(scenario: ScenarioName, partition: Partition) {
        this.store.dispatch(AppActions.togglePartition({ scenario, partition }));
    }

    public setStepFocus(scenario: ScenarioName, partition: Partition, stepId: string, focus: boolean) {
        this.store.dispatch(AppActions.stepSetFocus({ scenario, partition, stepId, focus }));
    }
}