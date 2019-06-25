import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ProcessStatesChanged, ProcessStarted } from './wps.actions';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { WorkflowControl, Process } from './workflowcontrol';




@Injectable()
export class WpsEffects {


    @Effect()
    productsProvided$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.productsProvided),
        map((action: ProductsProvided) => {
            for (let product of action.payload.products) {
                this.wfc.provideProduct(product);
            }
            return this.wfc.processes;
        }),
        switchMap((newProcesses: Process[]) => {
            return of(new ProcessStatesChanged({ processes: newProcesses }));
        })
    );


    @Effect()
    processStarted$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.processStarted),
        switchMap((action: ProcessStarted) => {
            return this.wfc.executeProcess(action.payload.process);
        }),
        map((result: boolean) => {
            return new ProcessStatesChanged({processes: this.wfc.processes});
        })
    );



    constructor(
        private actions$: Actions,
        private wfc: WorkflowControl
    ) { }
}