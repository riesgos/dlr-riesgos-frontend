import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ProcessStarted, InitialStateObtained, ScenarioChosen, ClickRunProcess, WpsDataUpdate, RestartingFromProcess } from './wps.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { WpsClient, WpsData } from 'projects/services-wps/src/public_api';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { filterInputsForProcess } from './wps.selectors';
import { NewProcessClicked, GoToNextProcess } from 'src/app/focus/focus.actions';
import { WorkflowControl } from './workflowcontrol';




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
                const processes = this.wfc.getProcesses();
                const products = this.wfc.getProducts();
                return new WpsDataUpdate({processes: processes, products: products});
            }

        })
    )


    @Effect()
    runProcessClicked$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.clickRunProduct), 
        switchMap((action: ClickRunProcess) => {
            const newProducts = action.payload.productsProvided;
            const process = action.payload.process;
            for (let prod of newProducts) {
                this.wfc.provideProduct(prod.description.id, prod.value);
            }
            return this.wfc.execute(process.id)
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
            
        })
    );



    private wfc: WorkflowControl;

    constructor( private httpClient: HttpClient, private actions$: Actions, private store$: Store<State> ) {

    }


}