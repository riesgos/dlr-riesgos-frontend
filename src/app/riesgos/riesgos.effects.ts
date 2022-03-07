import { Injectable } from '@angular/core';
import { Actions, ofType, Effect, createEffect } from '@ngrx/effects';
import { RiesgosActions, ERiesgosActionTypes, ProductsProvided, ScenarioChosen,
        ClickRunProcess, RiesgosDataUpdate, RestartingFromProcess, RestartingScenario, MetadataProvided } from './riesgos.actions';
import { map, switchMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { WorkflowControl } from './riesgos.workflowcontrol';
import { Process, Product } from './riesgos.datatypes';
import { getScenarioRiesgosState } from './riesgos.selectors';
import { RiesgosScenarioState } from './riesgos.state';
import { Observable } from 'rxjs';
import { ErrorParserService } from '../error-parser.service';
import { NewProcessClicked, AppInit, FocusAction, EFocusActionTypes } from '../focus/focus.actions';
import { RiesgosService } from './riesgos.service';




@Injectable()
export class RiesgosEffects {

    appInit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType<FocusAction>(EFocusActionTypes.appInit),
            map((action: AppInit) => {
                const metadata = this.scenarioService.loadScenarioMetadata();
                return new MetadataProvided({metadata});
            })
        );
    });

    restartingScenario$ = createEffect(() => {
        return this.actions$.pipe(
            ofType<RiesgosActions>(ERiesgosActionTypes.restartingScenario),
            switchMap((action: RestartingScenario) => {

                const [procs, prods] = this.loadScenarioDataFresh(action.payload.scenario);

                this.wfc = new WorkflowControl(procs, prods, this.errorParser);
                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();

                const actions: Action[] = [
                    new RiesgosDataUpdate({processes, products, graph}),
                    new NewProcessClicked({processId: null})
                ];
                return actions;
            })
        );

    });


    scenarioChosen$ = createEffect(() => {
        return this.actions$.pipe(
            ofType<RiesgosActions>(ERiesgosActionTypes.scenarioChosen),
            withLatestFrom(this.store$),
            switchMap(([action, state]: [ScenarioChosen, State]) => {
                const newScenario = action.payload.scenario;
    
                let procs: Process[];
                let prods: Product[];
                if (state.riesgosState.scenarioData[newScenario]) {
                    let _;
                    const scenarioData = state.riesgosState.scenarioData[newScenario];
                    // because processes are more than the ImmutableProcesses stored in the state-store:
                    prods = scenarioData.productValues; // getting products from state-store ...
                    [procs, _] = this.loadScenarioDataFresh(action.payload.scenario); // ... but processes from registry.
                } else {
                    [procs, prods] = this.loadScenarioDataFresh(action.payload.scenario);
                }
    
                this.wfc = new WorkflowControl(procs, prods, this.errorParser);
                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();
    
                const actions: Action[] = [new RiesgosDataUpdate({processes, products, graph})];
                return actions;
            })
        );
    }); 


    productsProvided$ = createEffect(() => {
        return this.actions$.pipe(
            ofType<RiesgosActions>(ERiesgosActionTypes.productsProvided),
            map((action: ProductsProvided) => {
    
                for (const product of action.payload.products) {
                    this.wfc.provideProduct(product.uid, product.value);
                }
                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();
                return new RiesgosDataUpdate({processes, products, graph});
    
            })
        );
    });
    


    runProcessClicked$ = createEffect(() => {
        return this.actions$.pipe(
            ofType<RiesgosActions>(ERiesgosActionTypes.clickRunProduct),
            mergeMap((action: ClickRunProcess) =>  {
    
                const newProducts = action.payload.productsProvided;
                const process = action.payload.process;
                for (const prod of newProducts) {
                    this.wfc.provideProduct(prod.uid, prod.value);
                }
                return this.wfc.execute(process.uid,
                    (response, counter) => {
                        if (counter < 1) {
                            this.store$.dispatch(new RiesgosDataUpdate({
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
                const wpsUpdate = new RiesgosDataUpdate({processes, products, graph});
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
            ofType<RiesgosActions>(ERiesgosActionTypes.restartingFromProcess),
            map((action: RestartingFromProcess) => {
    
                this.wfc.invalidateProcess(action.payload.process.uid);
                const processes = this.wfc.getImmutableProcesses();
                const products = this.wfc.getProducts();
                const graph = this.wfc.getGraph();
                return new RiesgosDataUpdate({processes, products, graph});
    
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
