import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ProcessStatesChanged, ProcessStarted } from './wps.actions';
import { WpsWorkflowControl } from './wpsWorkflowControl';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Product } from './product';
import { ProcessState } from './wps.state';




@Injectable()
export class WpsEffects {


    @Effect()
    productsProvided$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.productsProvided),
        map((action: ProductsProvided) => {
            for (let product of action.payload.products) {
                this.wfc.setProduct(product);
            }
            const newStates = this.wfc.getStates();
            return newStates;
        }),
        switchMap((newStates: ProcessState[]) => {
            return of(new ProcessStatesChanged({ processStates: newStates }));
        })
    );


    @Effect()
    processStarted$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.processStarted),
        switchMap((action: ProcessStarted) => {
            return this.wfc.executeProcess(action.payload.process);
        }),
        map((results: Product[]) => {
            return new ProductsProvided({products: results});
        })
    );



    constructor(
        private actions$: Actions,
        private wfc: WpsWorkflowControl
    ) { }
}