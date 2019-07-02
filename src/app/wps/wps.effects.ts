import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ScenarioChosen, ClickRunProcess, WpsDataUpdate, RestartingFromProcess } from './wps.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { WpsClient, WpsData } from 'projects/services-wps/src/public_api';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { filterInputsForProcess } from './wps.selectors';
import { NewProcessClicked, GoToNextProcess } from 'src/app/focus/focus.actions';
import { WorkflowControl } from './wps.workflowcontrol';
import { EqEventCatalogue } from '../configuration/chile/eqEventCatalogue';
import { EqGroundMotion, EqGroundMotionProvider } from '../configuration/chile/eqGroundMotion';
import { EqTsInteraction } from '../configuration/chile/eqTsInteraction';
import { TsPhysicalSimulation } from '../configuration/chile/tsPhysicalSimulation';
import { Process, Product } from './wps.datatypes';




@Injectable()
export class WpsEffects {


    @Effect()
    scenarioChosen$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.scenarioChosen), 
        switchMap((action: ScenarioChosen) => {

            const [rawProcs, rawProds] = this.loadScenarioData(action.payload.scenario);
            this.wfc = new WorkflowControl(rawProcs, rawProds, this.httpClient); 
            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();

            const wpsUpdate = new WpsDataUpdate({processes: processes, products: products});
            const processClicked = new NewProcessClicked({processId: processes[0].id});

            return [wpsUpdate, processClicked];
        })
    );

    @Effect()
    ProductsProvided = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.productsProvided), 
        map((action: ProductsProvided) => {

            for(let product of action.payload.products) {
                this.wfc.provideProduct(product.description.id, product.value);
            }
            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();
            return new WpsDataUpdate({processes: processes, products: products});

        })
    )


    @Effect()
    runProcessClicked$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.clickRunProduct), 
        switchMap((action: ClickRunProcess) =>  {

            const newProducts = action.payload.productsProvided;
            const process = action.payload.process;
            for (let prod of newProducts) {
                this.wfc.provideProduct(prod.description.id, prod.value);
            }

            return this.wfc.execute(process.id, 
                
                (response, counter) => {
                    if(counter < 1) {
                        this.store$.dispatch(new WpsDataUpdate({
                            processes: this.wfc.getProcesses(), 
                            products: this.wfc.getProducts()
                        }));
                    }
            });
        }),
        map((success: boolean) => {

            return new WpsDataUpdate({
                processes: this.wfc.getProcesses(), 
                products: this.wfc.getProducts()
            })

        })
    );


    @Effect()
    restartingFromProcess$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.restartingFromProcess), 
        map((action: RestartingFromProcess) => {

            this.wfc.invalidateProcess(action.payload.process.id);
            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();
            return new WpsDataUpdate({processes: processes, products: products});

        })
    );



    private wfc: WorkflowControl;

    constructor( private httpClient: HttpClient, private actions$: Actions, private store$: Store<State> ) {
        //this.wfc = new WorkflowControl([], [], this.httpClient);
    }


    /**
     * @TODO: in the future, this will also load data from files
     */
    private loadScenarioData(scenario: string): [Process[], Product[]] {
        const processes = [EqEventCatalogue, EqGroundMotionProvider, EqGroundMotion, EqTsInteraction, TsPhysicalSimulation];
        const products = this.createEmptyProducts(processes);
        return [processes, products];
    }


    private createEmptyProducts(processes: Process[]): Product[] {
        let products: Product[] = [];
        for(let process of processes) {
            for(let prodDescr of process.requiredProducts) {
                products.push({
                    description: prodDescr, 
                    value: null
                })
            }
            products.push({
                description: process.providedProduct, 
                value: null
            })
        }
        return products;
    }

}