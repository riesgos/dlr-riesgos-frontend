import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ProcessStatesChanged, ProcessStarted, InitialStateObtained, ScenarioChosen } from './wps.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { WpsClient, WpsData } from 'projects/services-wps/src/public_api';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getInputsForProcess, filterInputsForProcess, convertProductsToWpsData, convertWpsDataToProds } from './wps.selectors';




@Injectable()
export class WpsEffects {


    @Effect()
    processStarted$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.processStarted),
        withLatestFrom(this.store$),
        switchMap(([action, state]) => {
            const process = (action as ProcessStarted).payload.process;
            const inpts = filterInputsForProcess(process, state.wpsState.productValues);
            const inputs = convertProductsToWpsData(inpts);
            return this.wpsClient.executeAsync(process.url, process.id, inputs, process.providedProduct, 500);
        }),
        map((result: WpsData[]) => {
            const prods = convertWpsDataToProds(result);
            return new ProductsProvided({products: prods});
        })
    );

    private wpsClient: WpsClient;

    constructor( httpClient: HttpClient, private actions$: Actions, private store$: Store<State> ) {
        this.wpsClient = new WpsClient("1.0.0", httpClient);
    }


}