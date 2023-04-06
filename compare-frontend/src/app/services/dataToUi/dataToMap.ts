import Layer from "ol/layer/Layer";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Partition, RiesgosProductResolved, RiesgosScenarioMapState, RiesgosScenarioState, RiesgosState, ScenarioName } from "src/app/state/state";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { Observable, bufferCount, defaultIfEmpty, filter, forkJoin, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { DataService } from "../data.service";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { allProductsEqual, arraysEqual } from "src/app/state/helpers";
import * as AppActions from 'src/app/state/actions';



export interface MapState extends RiesgosScenarioMapState {
    layers: Layer[]
}


@Injectable({
    providedIn: 'root'
})
export class MapService {
    constructor(
        private store: Store<{ riesgos: RiesgosState }>,
        private resolver: DataService
    ) {}

    /**
     * Only returns a value if something map-relevant has changed
     */
    public getMapData(scenario: ScenarioName, partition: Partition): Observable<MapState> {

        const scenarioState$ = this.store.select(state => {
            const riesgosState = state.riesgos;
            const scenarioState = riesgosState.scenarioData[scenario]![partition];
            const focussedStep = riesgosState.focusState.focusedStep;
            return { scenarioState, focussedStep };
        });
        
        const changedState$ = scenarioState$.pipe(
            bufferCount(2, 1),
            filter(([last, current]) => {
              // only run when something important has changed. Prevents double-fetches.
              if (!current.scenarioState.active) return false;
              if (last.focussedStep !== current.focussedStep) return true;
              if (!allProductsEqual(last.scenarioState.products, current.scenarioState.products)) return true;
              if (last.scenarioState.map.zoom !== current.scenarioState.map.zoom) return true;
              if (last.scenarioState.map.center[0] !== current.scenarioState.map.center[0]) return true;
              if (last.scenarioState.map.center[1] !== current.scenarioState.map.center[1]) return true;
              if (
                last.scenarioState.map.clickLocation !== undefined && current.scenarioState.map.clickLocation !== undefined &&
                !arraysEqual(last.scenarioState.map.clickLocation!, current.scenarioState.map.clickLocation!)
              ) return true;
              return false;
            }),
            map(([_, current]) => current)
        );

        const resolvedData$ = changedState$.pipe(
            switchMap(({scenarioState, focussedStep}) => {
                const currentStep = scenarioState.steps.find(s => s.step.id === focussedStep);
                if (!currentStep) return of([]);

                const outputIds = currentStep.step.outputs.map(o => o.id);
                const outputProducts = scenarioState.products.filter(p => outputIds.includes(p.id)).filter(p => p.value || p.reference);
                return this.resolver.resolveReferences(outputProducts);
            })
        );

        const layers$ = resolvedData$.pipe(
            withLatestFrom(changedState$),
            mergeMap(([resolved, {scenarioState, focussedStep}]) => {
                const newLayers$ = resolved.map(p => toOlLayers(scenario, focussedStep, p));
                return forkJoin(newLayers$).pipe(defaultIfEmpty([]));  // observable won't fire without defaultIfEmpty
            }),
            map(newLayers => newLayers.flat())
        );

        const fullMapState$ = layers$.pipe(
            withLatestFrom(changedState$),
            map(([layers, {scenarioState, focussedStep}]) => {
                return {
                    ... scenarioState.map,
                    layers: layers
                }
            })
        )

        return fullMapState$;
    }

    public mapClick(scenario: ScenarioName, partition: Partition, location: number[]) {
        this.store.dispatch(AppActions.mapClick({ scenario: scenario, partition: partition, location: location }));
    }

    public mapMove(scenario: ScenarioName, partition: Partition, zoom: any, center: any) {
        this.store.dispatch(AppActions.mapMove({ scenario: scenario, partition: partition, zoom, center }))
    }
}


export function getMapPositionForStep(scenario: ScenarioName, partition: Partition, stepId: string): {center: number[], zoom: number} {
    if (scenario === 'PeruShort') {
        switch (stepId) {
            case 'selectEq':
                return { zoom: 7, center: [-77.6, -12] };
            case 'EqSimulation':
                return { zoom: 7, center: [-77.15, -12] };
            case 'Exposure':
                return { zoom: 10, center: [-77.15, -12] };
            case 'EqDamage':
                return { zoom: 10, center: [-77.15, -12] };
            case 'Tsunami':
                return { zoom: 6, center: [-77.15, -12] };
            case 'TsDamage':
                return { zoom: 10, center: [-77.15, -12] };
            case 'SysRel':
                return { zoom: 9.5, center: [-77.15, -12] };
        }
    }
    return { zoom: 4, center: [-77.15, -12] };
}


export function toOlLayers(scenario: ScenarioName, step: string, product: RiesgosProductResolved): Observable<Layer[]> {
    if (scenario === 'PeruShort') {
        switch (product.id) {
            case 'selectedEq':
                return of([new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(product.value)
                    }),
                })]);

            case 'eqSimXmlRef':
                return of([]);

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

            case 'exposureRef':
                return of([]);
            
            case 'exposure':
                return of([new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON({ dataProjection: 'EPSG:4326' }).readFeatures(product.value)
                    })
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

            case 'eqDamageSummary':
            case 'eqDamageRef':
                return of([]);

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

            case 'tsDamageSummary':
            case 'tsDamageRef':
                return of([]);

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