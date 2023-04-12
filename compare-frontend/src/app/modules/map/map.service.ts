import Layer from "ol/layer/Layer";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Partition, RiesgosProductResolved, RiesgosScenarioMapState, RiesgosScenarioState, RiesgosState, ScenarioName } from "src/app/state/state";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { Observable, OperatorFunction, bufferCount, combineLatest, defaultIfEmpty, filter, forkJoin, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { allProductsEqual, maybeArraysEqual } from "src/app/state/helpers";
import * as AppActions from 'src/app/state/actions';
import { DataService } from "src/app/services/data.service";
import { Injectable } from "@angular/core";
import { ConverterService, LayerComposite } from "./converter.service";



export interface MapState extends RiesgosScenarioMapState {
    layerComposites: LayerComposite[],
}


@Injectable()  // providedIn: MapModule?
export class MapService {
    
    constructor(
        private store: Store<{ riesgos: RiesgosState }>,
        private resolver: DataService,
        private converterSvc: ConverterService
    ) { }


    /**
                       ┌───► mapState ─────────────────────┐
                       │                                   └► fullState
    state ────► changedState────► resolvedData─┐            ┌►
                       │                       │            │
                       └──────────────────────►└─► layers───┘
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
            bufferCount(2, 1),
            filter(([last, current]) => {
                // only run when something important has changed. Prevents double-fetches.
                if (!current.active) return false;
                if (last.focus.focusedStep !== current.focus.focusedStep) return true;
                if (!allProductsEqual(last.products, current.products)) return true;
                if (last.map.zoom !== current.map.zoom) return true;
                if (last.map.center[0] !== current.map.center[0]) return true;
                if (last.map.center[1] !== current.map.center[1]) return true;
                if (!maybeArraysEqual(last.map.clickLocation!, current.map.clickLocation!)) return true;
                return false;
            }),
            map(([_, current]) => current)
        );

        const mapState$ = changedState$.pipe(map(scenarioState => {
                return scenarioState.map;
        }));

        const resolvedData$ = changedState$.pipe(switchMap(state => {
            const currentStep = state.steps.find(s => s.step.id === state.focus.focusedStep);
            if (!currentStep) return of([]);

            const outputIds = currentStep.step.outputs.map(o => o.id);
            const outputProducts = state.products.filter(p => outputIds.includes(p.id)).filter(p => p.value || p.reference);
            return this.resolver.resolveReferences(outputProducts);
        }));

        const layers$ = combineLatest([changedState$, resolvedData$]).pipe(switchMap(([scenarioState, resolvedData]) => {
            const converter = this.converterSvc.getConverter(scenario, scenarioState.focus.focusedStep);
            return converter.makeLayers(scenarioState, resolvedData);
        }));

        const fullState$ = combineLatest([mapState$, layers$]).pipe(map(([mapState, layers]) => {
            return {
                ...mapState,
                layers
            }
        }));

        return fullState$;
    }

    public mapClick(scenario: ScenarioName, partition: Partition, location: number[]) {
        this.store.dispatch(AppActions.mapClick({ scenario: scenario, partition: partition, location: location }));
    }

    public mapMove(scenario: ScenarioName, partition: Partition, zoom: any, center: any) {
        this.store.dispatch(AppActions.mapMove({ scenario: scenario, partition: partition, zoom, center }))
    }

    public closePopup(scenario: ScenarioName, partition: Partition) {
        this.store.dispatch(AppActions.mapClick({ scenario: scenario, partition: partition, location: undefined }));
      }


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


