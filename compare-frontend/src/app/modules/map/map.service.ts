import GeoJSON from 'ol/format/GeoJSON';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import { defaultIfEmpty, filter, forkJoin, map, Observable, of, OperatorFunction, scan, switchMap, withLatestFrom } from 'rxjs';
import { ResolverService } from 'src/app/services/resolver.service';
import * as AppActions from 'src/app/state/actions';
import { allProductsEqual, arraysEqual, maybeArraysEqual } from 'src/app/state/helpers';
import { Partition, RiesgosProductResolved, RiesgosScenarioMapState, RiesgosScenarioState, RiesgosState, ScenarioName } from 'src/app/state/state';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ConverterService, LayerComposite } from './converter.service';
import { getRules, Rules } from 'src/app/state/rules';

export interface MapState extends RiesgosScenarioMapState {
    layerComposites: LayerComposite[],
}


@Injectable()
export class MapService {
    
    constructor(
        private store: Store<{ riesgos: RiesgosState }>,
        private resolver: ResolverService,
        private converterSvc: ConverterService
    ) { }


    /**
     * ```
     *                     ┌───► mapState ──────────────────────────────┐
     *                     │                                            └► fullState
     *  state ────► changedState────► resolvedData─┐                     ┌►
     *                     │                       │                     │
     *                     └──────────────────────►└─► layerComposites───┘
     * ```
     */
    public getMapState(scenario: ScenarioName, partition: Partition): Observable<MapState> {

        let rules: Rules;

        const scenarioState$ = this.store.select(state => {
            rules = getRules(state.riesgos.rules);
            const riesgosState = state.riesgos;
            const scenarioState = riesgosState.scenarioData[scenario];
            if (!scenarioState) return undefined;
            const partitionState = scenarioState[partition];
            return partitionState;
        }).pipe(filter(v => v !== undefined) as OperatorFunction<RiesgosScenarioState | undefined, RiesgosScenarioState>);



        const changedState$ = scenarioState$.pipe(
            scan((acc: (RiesgosScenarioState | undefined)[], cur: RiesgosScenarioState) => [acc[1], cur], [undefined, undefined]),
            filter(([last, current]) => {
                // only run when something important has changed. Prevents double-fetches.
                if (current === undefined) return false;
                if (last === undefined) return true;
                if (!current.active) return false;
                if (!arraysEqual(last.focus.focusedSteps, current.focus.focusedSteps)) return true;
                if (!allProductsEqual(last.products, current.products)) return true;
                if (last.map.zoom !== current.map.zoom) return true;
                if (!arraysEqual(last.map.center, current.map.center)) return true;
                if (!arraysEqual(last.map.layerSettings, current.map.layerSettings)) return true;
                if (!maybeArraysEqual(last.map.clickLocation!, current.map.clickLocation!)) return true;
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

        const layerComposites$ = resolvedData$.pipe(
            withLatestFrom(changedState$),
            switchMap(([resolvedData, scenarioState]) => {
                const lcs$ = [];
                for (const stepId of scenarioState.focus.focusedSteps) {
                    const converter = this.converterSvc.getConverter(scenario, stepId);
                    const layerComposite$ = converter.makeLayers(scenarioState, resolvedData);
                    lcs$.push(layerComposite$);
                }
                return forkJoin(lcs$).pipe(defaultIfEmpty([]));
            })
        );


        const mapState$ = changedState$.pipe(map(scenarioState => {
            return scenarioState.map;
        }));

        const fullState$ = layerComposites$.pipe(
            withLatestFrom(mapState$),
            map(([layerComposites, mapState]) => { 

                const composites = layerComposites.flat();

                // apply user defined visibility
                for (const customLayerSetting of mapState.layerSettings) {
                    const composite = composites.find(c => c.id === customLayerSetting.layerCompositeId);
                    if (composite) {
                        composite.visible = customLayerSetting.visible;
                    }
                }

                return {
                    ...mapState,
                    layerComposites: composites
                }
            }
        ));

        return fullState$;
    }

    public mapClick(scenario: ScenarioName, partition: Partition, location: number[], clickedFeature?: {compositeId: string, feature: any} ) {
        if (!clickedFeature) {
            this.store.dispatch(AppActions.mapClick({ scenario: scenario, partition: partition, location: location }));
        } else {
            this.store.dispatch(AppActions.mapClick({ scenario: scenario, partition: partition, location: location, clickedFeature: {compositeId: clickedFeature.compositeId} }));
        }
    }

    public mapMove(scenario: ScenarioName, partition: Partition, zoom: any, center: any) {
        this.store.dispatch(AppActions.mapMove({ scenario: scenario, partition: partition, zoom, center }))
    }

    public closePopup(scenario: ScenarioName, partition: Partition) {
        this.store.dispatch(AppActions.mapClick({ scenario: scenario, partition: partition, location: undefined }));
      }


}


