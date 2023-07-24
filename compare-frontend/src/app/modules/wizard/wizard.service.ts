import { filter, map, Observable, of, OperatorFunction, scan, share, switchMap, withLatestFrom } from 'rxjs';
import { ResolverService } from 'src/app/services/resolver.service';
import * as AppActions from 'src/app/state/actions';
import { allProductsEqual, arraysEqual, maybeArraysEqual } from 'src/app/state/helpers';
import { Partition, RiesgosScenarioState, RiesgosState, RiesgosStep, ScenarioName } from 'src/app/state/state';
import { Injectable, Type } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConverterService } from './converter.service';
import { getRules, Rules } from 'src/app/state/rules';
import { MapService } from '../map/map.service';
import { LayerComposite } from '../map/converter.service';

export interface WizardComposite {
    step: RiesgosStep,
    info?: () => { component: Type<any>, args: {[key: string]: any} },
    legend?: () => { component: Type<any>, args: {[key: string]: any} },
    inputs: {
        productId: string,
        formtype: 'string' | 'string-select',
        options?: { [key: string]: any },
        currentValue?: any,
        label: string,
    }[],
    hasFocus: boolean,
    isAutoPiloted?: boolean,
    layerControlables: LayerComposite[],
    oneLayerOnly: boolean
}

export interface WizardState {
    stepData: WizardComposite[],
    wizardExpanded: boolean
}

@Injectable()
export class WizardService {

    constructor(
        private store: Store<{ riesgos: RiesgosState }>,
        private resolver: ResolverService,
        private converterSvc: ConverterService,
        private mapService: MapService
    ) {}


    /**
     *  state$ ──────► changedState$ ─────► resolvedData$ ─────┐
     *                             │                           │
     *                             │                           ▼
     *                             └────────────────────────► wizardState$
     *                                                        ▲
     * map$ ──────────────────────────────────────────────────┘
     */
    public getWizardState(scenario: ScenarioName, partition: Partition): Observable<WizardState> {

        // Silly little hack. We should probably just have rules on the scenario-level of state, not the root-level.
        let rules: Rules; 

        const scenarioState$ = this.store.select(state => {
            rules = getRules(state.riesgos.rules);
            const scenarioStates = state.riesgos.scenarioData[scenario];
            if (!scenarioStates) return undefined;
            const scenarioState = scenarioStates[partition];
            return scenarioState;
        }).pipe(
            filter(v => v !== undefined) as OperatorFunction<RiesgosScenarioState | undefined, RiesgosScenarioState>,
        );

        const changedState$ = scenarioState$.pipe(
            // changedState is siphoned off by resolvedData and wizardState.
            // To prevent running this block twice - and causing ui updates twice - it's turned hot here.
            // share(),

            // filtering to prevent rebuilding ui on insignificant changes.
            scan((acc: (RiesgosScenarioState | undefined)[], cur: RiesgosScenarioState) => [acc[1], cur], [undefined, undefined]),
            filter(([last, current]) => {
                if (current === undefined) return false;
                if (last === undefined) return true;
                if (!current.active) return false;
                if (last.active !== current.active) return true;
                if (last.controlExpanded !== current.controlExpanded) return true;
                if (!maybeArraysEqual(last.focus.focusedSteps, current.focus.focusedSteps)) return true;
                if (!allProductsEqual(last.products, current.products)) return true;
                if (!maybeArraysEqual(last.map.clickLocation!, current.map.clickLocation!)) return true;
                if (!arraysEqual(last.map.layerSettings, current.map.layerSettings)) return true;
                if (!arraysEqual(last.steps.map(s => s.state.type), current.steps.map(s => s.state.type))) return true;
                return false;
            }) as OperatorFunction<(RiesgosScenarioState | undefined)[], RiesgosScenarioState[]>,
            map(([_, current]) => current),
        );

        const resolvedData$ = changedState$.pipe(switchMap(state => {
            const currentSteps = state.steps.filter(s => state.focus.focusedSteps.includes(s.step.id));
            if (currentSteps.length === 0) return of([]);
            const outputIds = currentSteps.map(s => s.step.outputs.map(o => o.id)).flat();
            const outputProducts = state.products.filter(p => outputIds.includes(p.id)).filter(p => p.value || p.reference);
            return this.resolver.resolveReferences(outputProducts);
        }));

        const mapState$ = this.mapService.getMapState(scenario, partition);

        const wizardState$ = resolvedData$.pipe(
            withLatestFrom(changedState$, mapState$),
            map(([resolvedData, state, mapState]) => {
                const stepData: WizardComposite[] = [];

                const autoPilotables = state.steps.map(s => s.step.id).filter(id => rules.autoPilot(id));
                for (const step of state.steps) {
                    let stepDatum: WizardComposite;
                    if (state.focus.focusedSteps.includes(step.step.id)) {
                        const converter = this.converterSvc.getConverter(scenario, step.step.id);
                        stepDatum = converter.getInfo(state, resolvedData);

                        // updating WizardComposite with current state
                        stepDatum.hasFocus = true;
                        stepDatum.isAutoPiloted = autoPilotables.includes(step.step.id);
                        stepDatum.layerControlables = mapState.layerComposites.filter(l => l.stepId === stepDatum.step.step.id);

                    } else {
                        stepDatum = {
                            step: step,
                            inputs: [],
                            hasFocus: false,
                            isAutoPiloted: autoPilotables.includes(step.step.id),
                            layerControlables: [],
                            oneLayerOnly: false
                        }
                    }
                    stepData.push(stepDatum);
                }

                return { stepData: stepData, wizardExpanded: state.controlExpanded };
            })
        );

        return wizardState$;
    }

    public toggleFocus(scenario: ScenarioName, partition: Partition) {
        this.store.dispatch(AppActions.togglePartition({ scenario, partition }));
    }

    public setStepFocus(scenario: ScenarioName, partition: Partition, stepId: string, focus: boolean) {
        this.store.dispatch(AppActions.stepSetFocus({ scenario, partition, stepId, focus }));
    }
}