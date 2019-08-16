import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ScenarioChosen, ClickRunProcess, WpsDataUpdate, RestartingFromProcess } from './wps.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators'; 
import { HttpClient } from '@angular/common/http';
import { Store, Action, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { NewProcessClicked } from 'src/app/focus/focus.actions';
import { WorkflowControl } from './wps.workflowcontrol';
import { EqEventCatalogue, inputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat, selectedEqs } from '../configuration/chile/eqEventCatalogue';
import { EqGroundMotion, EqGroundMotionProvider, shakemapOutput, selectedEq } from '../configuration/chile/eqGroundMotion';
import { EqTsInteraction, epicenter } from '../configuration/chile/eqTsInteraction';
import { TsPhysicalSimulation, tsunamap, lat, lon, mag } from '../configuration/chile/tsPhysicalSimulation';
import { Process, Product } from './wps.datatypes';
import { UtilStoreService } from '@ukis/services-util-store';
import { getProcessStates } from './wps.selectors';
import { WpsState } from './wps.state';
import { LaharWps, direction, laharWms, intensity, parameter } from '../configuration/equador/lahar';
import { ExposureModel, exposure } from '../configuration/chile/exposure';
import { VulnerabilityModel, vulnerability } from '../configuration/chile/vulnerability';




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

            const actions: Action[] = [];

            const wpsUpdate = new WpsDataUpdate({processes: processes, products: products});
            actions.push(wpsUpdate);


            if(processes.length > 0) {
                const processClicked = new NewProcessClicked({processId: processes[0].id});
                actions.push(processClicked);
            }

            return actions;
        })
    );

    @Effect()
    ProductsProvided = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.productsProvided),
        map((action: ProductsProvided) => {

            for (const product of action.payload.products) {
                this.wfc.provideProduct(product.description.id, product.value);
            }
            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();
            return new WpsDataUpdate({processes: processes, products: products});

        })
    );


    @Effect()
    runProcessClicked$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.clickRunProduct), 
        switchMap((action: ClickRunProcess) =>  {

            const newProducts = action.payload.productsProvided;
            const process = action.payload.process;
            for (const prod of newProducts) {
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
        switchMap((success: boolean) => {

            const actions: Action[] = [];

            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();
            const wpsUpdate = new WpsDataUpdate({processes: processes, products: products});
            actions.push(wpsUpdate);

            const nextProcess = this.wfc.getActiveProcess();
            if (nextProcess && success) {
                const processClicked = new NewProcessClicked({processId: nextProcess.id});
                actions.push(processClicked);
            }

            return actions;

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

    constructor(
        private actions$: Actions,
        private store$: Store<State>,
        private httpClient: HttpClient,
        ) {
        //this.wfc = new WorkflowControl([], [], this.httpClient);
    }


    /**
     * @TODO: in the future, this will also load data from files
     */
    private loadScenarioData(scenario: string): [Process[], Product[]] {
        let processes: Process[] = [];
        let products: Product[] = [];
        switch (scenario) {
            case 'c1':
                processes = [
                    ExposureModel, VulnerabilityModel,
                    EqEventCatalogue, EqGroundMotionProvider,
                    EqGroundMotion, EqTsInteraction,
                    TsPhysicalSimulation
                ];
                products = [
                    exposure, vulnerability,
                    inputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
                    selectedEqs, selectedEq, shakemapOutput,
                    epicenter, lat, lon, mag,
                    tsunamap
                ];
                return [processes, products];
            case 'e1':
                processes = [LaharWps];
                products = [direction, intensity, parameter, laharWms];
                return [processes, products];
            case 'p1':
                processes = [];
                products = [];
                return [processes, products];
            default:
                throw new Error(`Unknown scenario ${scenario}`)
        }
    }

}