import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ProcessStatesChanged, ProcessStarted, InitialStateObtained, ScenarioChosen } from './wps.actions';
import { map, switchMap } from 'rxjs/operators'; 
import { WorkflowControl } from './workflowcontrol';




@Injectable()
export class WpsEffects {

    @Effect()
    scenarioChosen$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.scenarioChosen),
        map((action: ScenarioChosen) => {
            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();
            return new InitialStateObtained({processes: processes, products: products});
        })
    )

    @Effect()
    productsProvided$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.productsProvided),
        map((action: ProductsProvided) => {
            action.payload.products.forEach((v, k) => {
                this.wfc.provideProductValue(k, v.value);
            });
            const newProcesses = this.wfc.getProcesses();
            return new ProcessStatesChanged({ processes: newProcesses });
        })
    );


    @Effect()
    processStarted$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.processStarted),
        switchMap((action: ProcessStarted) => {
            return this.wfc.executeProcess(action.payload.process.id);
            // TODO: already fire a ProcessStatesChanged here!!
        }),
        map((result: boolean) => {
            return new ProcessStatesChanged({processes: this.wfc.getProcesses()});
        })
    );



    constructor(
        private actions$: Actions,
        private wfc: WorkflowControl
    ) { }
}