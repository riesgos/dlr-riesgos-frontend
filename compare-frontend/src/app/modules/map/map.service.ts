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

        const scenarioState$ = this.store.select(state => {
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
                if (!arraysEqual(last.map.layerVisibility, current.map.layerVisibility)) return true;
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
                for (const customOpacitySetting of mapState.layerVisibility) {
                    const composite = composites.find(c => c.id === customOpacitySetting.layerCompositeId);
                    if (composite) {
                        composite.opacity = customOpacitySetting.opacity;
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


      /**
       * deprecated. kept in code only as a reference while i'm busy building 
       * converters for all steps.
       */
    private toOlLayers(scenario: ScenarioName, step: string, product: RiesgosProductResolved): Observable<Layer[]> {
        if (scenario === 'PeruShort') {

            switch (product.id) {

                case 'eqSimWms':
                    const fullUrl = new URL(product.value);
                    const baseUrl = fullUrl.origin + fullUrl.pathname;
                    const layers = fullUrl.searchParams.get("layers");
                    return of([new TileLayer({
                        source: new TileWMS({
                            url: baseUrl,
                            params: {
                                "LAYERS": layers,
                                "STYLES": "shakemap-pga"
                            }
                        }),
                        opacity: 0.4
                    })]);


                case 'eqDamageWms':
                    const fullUrl1 = new URL(product.value);
                    const baseUrl1 = fullUrl1.origin + fullUrl1.pathname;
                    const layers1 = fullUrl1.searchParams.get("layers");
                    return of([new TileLayer({
                        source: new TileWMS({
                            url: baseUrl1,
                            params: {
                                "LAYERS": layers1,
                                "STYLES": "style-cum-loss-peru-plasma"
                            }
                        }),
                        opacity: 0.9
                    })]);

                case 'tsWms':
                    const fullUrl3 = new URL(product.value);
                    const baseUrl3 = fullUrl3.origin + fullUrl3.pathname;
                    const layers3 = fullUrl3.pathname.match(/(\d+)/)![0] + '_mwh';
                    return of([new TileLayer({
                        source: new TileWMS({
                            url: baseUrl3,
                            params: {
                                layers: layers3
                            }
                        }),
                        opacity: 0.9
                    })]);

                case 'tsDamageWms':
                    const fullUrl2 = new URL(product.value);
                    const baseUrl2 = fullUrl2.origin + fullUrl2.pathname;
                    const layers2 = fullUrl2.searchParams.get("layers");
                    return of([new TileLayer({
                        source: new TileWMS({
                            url: baseUrl2,
                            params: {
                                "LAYERS": layers2,
                                "STYLES": "style-cum-loss-peru-plasma"
                            }
                        }),
                        opacity: 0.9
                    })]);

                case 'sysRel':
                    return of([new VectorLayer({
                        source: new VectorSource({
                            features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(product.value)
                        })
                    })]);
                default:
                    console.log(`Don't know how to render product: `, product);
            }
        }
        return of([]);
    }

}


