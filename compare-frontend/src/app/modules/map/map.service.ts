import Layer from "ol/layer/Layer";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Partition, RiesgosProductResolved, RiesgosScenarioMapState, RiesgosState, ScenarioName } from "src/app/state/state";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { Observable, bufferCount, combineLatest, defaultIfEmpty, filter, forkJoin, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { allProductsEqual, arraysEqual } from "src/app/state/helpers";
import * as AppActions from 'src/app/state/actions';
import { DataService } from "src/app/services/data.service";
import { Injectable, Type } from "@angular/core";
import { ConverterService, MapLayer } from "./converter.service";



export interface MapState extends RiesgosScenarioMapState {
    layers: MapLayer[],
}


@Injectable()  // providedIn: MapModule?
export class MapService {
    constructor(
        private store: Store<{ riesgos: RiesgosState }>,
        private converterSvc: ConverterService
    ) { }


    public getMapState(scenario: ScenarioName, partition: Partition): Observable<MapState> {

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

        const mapState$ = changedState$.pipe(map(({scenarioState}) => {
                return scenarioState.map;
        }));

        const layers$ = changedState$.pipe(switchMap(({focussedStep, scenarioState}) => {
            const converter = this.converterSvc.getConverter(scenario, focussedStep);
            return converter.makeLayers();
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


    private toOlLayers(scenario: ScenarioName, step: string, product: RiesgosProductResolved): Observable<Layer[]> {
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

}


