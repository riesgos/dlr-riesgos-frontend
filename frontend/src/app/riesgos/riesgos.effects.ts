import { Injectable } from '@angular/core';
import { Actions, ofType, Effect, createEffect } from '@ngrx/effects';
import * as RiesgosActions from './riesgos.actions';
import * as FocusActions from '../focus/focus.actions';
import { map, switchMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { WorkflowControl } from './riesgos.workflowcontrol';
import { Process, Product } from './riesgos.datatypes';
import { getScenarioRiesgosState } from './riesgos.selectors';
import { RiesgosScenarioState } from './riesgos.state';
import { Observable } from 'rxjs';
import { ErrorParserService } from '../services/errorParser/error-parser.service';
import { RiesgosService } from './riesgos.service';




@Injectable()
export class RiesgosEffects {

    appInit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(FocusActions.appInit),
            map(action => {
                const metadata = this.scenarioService.loadScenarioMetadata();
                return RiesgosActions.metadataProvided({metadata});
            })
        );
    });

    restartingScenario$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RiesgosActions.restartingScenario),
            switchMap(action => {

                const [procs, prods] = this.loadScenarioDataFresh(action.scenario);

                this.wfc = new WorkflowControl(procs, prods, this.errorParser);
                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();

                const actions: Action[] = [
                    RiesgosActions.riesgosDataUpdate({processes, products, graph}),
                    FocusActions.newProcessClicked({processId: null})
                ];
                return actions;
            })
        );

    });


    scenarioChosen$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RiesgosActions.scenarioChosen),
            withLatestFrom(this.store$),
            switchMap(([action, state]) => {
                const newScenario = action.scenario;

                let procs: Process[];
                let prods: Product[];
                if (state.riesgosState.scenarioData[newScenario]) {
                    let _;
                    const scenarioData = state.riesgosState.scenarioData[newScenario];
                    // because processes are more than the ImmutableProcesses stored in the state-store:
                    prods = scenarioData.productValues; // getting products from state-store ...
                    [procs, _] = this.loadScenarioDataFresh(action.scenario); // ... but processes from registry.
                } else {
                    [procs, prods] = this.loadScenarioDataFresh(action.scenario);
                }

                this.wfc = new WorkflowControl(procs, prods, this.errorParser);
                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();

                const actions: Action[] = [RiesgosActions.riesgosDataUpdate({processes, products, graph})];
                return actions;
            })
        );
    }); 


    productsProvided$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RiesgosActions.productsProvided),
            map(action => {

                for (const product of action.products) {
                    this.wfc.provideProduct(product.uid, product.value);
                }
                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();
                return RiesgosActions.riesgosDataUpdate({processes, products, graph});

            })
        );
    });



    runProcessClicked$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RiesgosActions.clickRunProcess),
            mergeMap(action =>  {

                const newProducts = action.productsProvided;
                const process = action.process;
                for (const prod of newProducts) {
                    this.wfc.provideProduct(prod.uid, prod.value);
                }
                return this.wfc.execute(process.uid,
                    (response, counter) => {
                        if (counter < 1) {
                            this.store$.dispatch(RiesgosActions.riesgosDataUpdate({
                                processes: this.wfc.getImmutableProcesses(),
                                products: this.wfc.getProducts(),
                                graph: this.wfc.getGraph()
                            }));
                        }
                }).pipe(map(success => {
                    return [success, process.uid];
                }));
            }),
            mergeMap(([success, processId]: [boolean, string]) => {
                const actions: Action[] = [];

                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();
                const wpsUpdate = RiesgosActions.riesgosDataUpdate({processes, products, graph});
                actions.push(wpsUpdate);

                // We abstain from moving on to the next process for now, until we have a nice way of finding the next one in line.
                // let nextProcess = this.wfc.getNextActiveChildProcess(processId);
                // if (! nextProcess) {
                //     nextProcess = this.wfc.getActiveProcess();
                // }
                // if (nextProcess && success) {
                //     const processClicked = new NewProcessClicked({processId: nextProcess.id});
                //     actions.push(processClicked);
                // }

                return actions;

            })
        );
    });



    restartingFromProcess$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RiesgosActions.restartingFromProcess),
            map(action => {

                this.wfc.invalidateProcess(action.process.uid);
                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();
                return RiesgosActions.riesgosDataUpdate({processes, products, graph});

            })
        );
    });



    private wfc: WorkflowControl;

    constructor(
        private actions$: Actions,
        private store$: Store<State>,
        private scenarioService: RiesgosService,
        private errorParser: ErrorParserService
        ) {}


    private loadScenarioData(scenario: string): Observable<[Process[], Product[]]> {
        // @TODO: per default, load data from store.
        return this.store$.select(getScenarioRiesgosState(scenario)).pipe(map((scenarioState: RiesgosScenarioState) => {
            if (scenarioState) {
                return [scenarioState.processStates, scenarioState.productValues];
            } else {
                return this.loadScenarioDataFresh(scenario);
            }
        }));
    }


    private loadScenarioDataFresh(scenario: string): [Process[], Product[]] {
        return this.scenarioService.loadScenarioData(scenario);
    }

}
