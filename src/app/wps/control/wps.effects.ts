import { Injectable } from "@angular/core";
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ProcessStatesChanged, ProcessStarted, InitialStateObtained, ScenarioChosen, ClickRunProcess } from './wps.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { WpsClient, WpsData } from 'projects/services-wps/src/public_api';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { filterInputsForProcess } from './wps.selectors';
import { NewProcessClicked } from 'src/app/focus/focus.actions';




@Injectable()
export class WpsEffects {


    @Effect()
    runProcessClicked$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.clickRunProduct), 
        switchMap((action: ClickRunProcess) => {
            return [
                new ProductsProvided({products: action.payload.productsProvided}), 
                new ProcessStarted({process: action.payload.process})
            ];
        })
    );


    @Effect()
    processStarted$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.processStarted),
        withLatestFrom(this.store$),
        switchMap(([action, state]) => {
            const process = (action as ProcessStarted).payload.process;
            const inputs = filterInputsForProcess(process, state.wpsState.productValues);
            return this.wpsClient.executeAsync(process.url, process.id, inputs, process.providedProduct, 500);
        }),
        map((result: WpsData[]) => {
            return new ProductsProvided({products: result});
        })
    );


    @Effect()
    scenarioChosen$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.scenarioChosen), 
        withLatestFrom(this.store$),
        map(([action, state]) => new NewProcessClicked({processId: state.wpsState.processStates[0].id}))
    );

    private wpsClient: WpsClient;

    constructor( httpClient: HttpClient, private actions$: Actions, private store$: Store<State> ) {
        this.wpsClient = new WpsClient("1.0.0", httpClient);
    }


}