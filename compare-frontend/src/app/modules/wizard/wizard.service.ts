import { bufferCount, combineLatest, filter, map, Observable, of, OperatorFunction, switchMap } from 'rxjs';
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
            bufferCount(2, 1),
            filter(([last, current]) => {
                if (!current.active) return false;
                if (last.focus.focusedStep !== current.focus.focusedStep) return true;
                if (!allProductsEqual(last.products, current.products)) return true;
                if (!maybeArraysEqual(last.map.clickLocation!, current.map.clickLocation!)) return true;
                return false;
            }),
            map(([_, current]) => current)
        );

        const resolvedData$ = changedState$.pipe(switchMap(state => {
            const currentStep = state.steps.find(s => s.step.id === state.focus.focusedStep);
            if (!currentStep) return of([]);

            const outputIds = currentStep.step.outputs.map(o => o.id);
            const outputProducts = state.products.filter(p => outputIds.includes(p.id)).filter(p => p.value || p.reference);
            return this.resolver.resolveReferences(outputProducts);
        }));

        const wizardState$ = combineLatest([changedState$, resolvedData$]).pipe(map(([scenarioState, resolvedData]) => {
            const steps: WizardComposite[] = [];
            for (const step of scenarioState.steps) {
                let stepData: WizardComposite;
                if (step.step.id === scenarioState.focus.focusedStep) {
                    const converter = this.converterSvc.getConverter(scenario, scenarioState.focus.focusedStep);
                    stepData = converter.getInfo(scenarioState, resolvedData);
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
        this.store.dispatch(AppActions.toggleFocus({ scenario, partition }));
    }

    public stepSelect(scenario: ScenarioName, partition: Partition, stepId: string) {
        this.store.dispatch(AppActions.stepSelect({ scenario, partition, stepId }));
    }
}