import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ScenarioChosen,
        ClickRunProcess, WpsDataUpdate, RestartingFromProcess } from './wps.actions';
import { toGraphviz } from './wps.graphviz';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store, Action, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { NewProcessClicked } from 'src/app/focus/focus.actions';
import { WorkflowControl } from './wps.workflowcontrol';
import { QuakeLedger, inputBoundingbox, mmin, mmax, zmin,
        zmax, p, etype, tlon, tlat, selectedEqs } from '../configuration/chile/quakeledger';
import { inputBoundingboxPeru, QuakeLedgerPeru } from '../configuration/peru/quakeledger';
import { Shakyground, shakemapWmsOutput, shakemapOutput } from '../configuration/chile/shakyground';
import { TsService, epicenter, lat, lon, mag } from '../configuration/chile/tsService';
import { Process, Product } from './wps.datatypes';
import { LaharWps, direction, laharWms, intensity, parameter } from '../configuration/equador/lahar';
import { ExposureModel, lonmin, lonmax, latmin, latmax, selectedRowsXml,
        assettype, schema, querymode } from '../configuration/chile/assetmaster';
import { VulnerabilityModel, assetcategory, losscategory, taxonomies, buildingAndDamageClasses } from '../configuration/chile/modelProp';
import { selectedEq, EqSelection, userinputSelectedEq } from '../configuration/chile/eqselection';
import { hydrologicalSimulation, geomerHydrological } from '../configuration/equador/geomerHydrological';
import { Deus, fragility, loss, damage, transition, updated_exposure } from '../configuration/chile/deus';
import { PhysicalImpactAssessment, physicalImpact } from '../configuration/chile/pia';




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
            const graph = this.wfc.getGraph();

            console.log(toGraphviz(this.wfc));

            const actions: Action[] = [];
            const wpsUpdate = new WpsDataUpdate({processes, products, graph});
            actions.push(wpsUpdate);
            if (processes.length > 0) {
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
                this.wfc.provideProduct(product.uid, product.value);
            }
            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();

            return new WpsDataUpdate({processes, products, graph});

        })
    );


    @Effect()
    runProcessClicked$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.clickRunProduct),
        switchMap((action: ClickRunProcess) =>  {

            const newProducts = action.payload.productsProvided;
            const process = action.payload.process;
            for (const prod of newProducts) {
                this.wfc.provideProduct(prod.uid, prod.value);
            }

            return this.wfc.execute(process.id,
                (response, counter) => {
                    if (counter < 1) {
                        this.store$.dispatch(new WpsDataUpdate({
                            processes: this.wfc.getProcesses(),
                            products: this.wfc.getProducts(),
                            graph: this.wfc.getGraph()
                        }));
                    }
            }).pipe(map(success => [success, process.id] ));
        }),
        switchMap(([success, processId]: [boolean, string]) => {

            const actions: Action[] = [];

            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();
            const wpsUpdate = new WpsDataUpdate({processes, products, graph});
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


    @Effect()
    restartingFromProcess$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.restartingFromProcess),
        map((action: RestartingFromProcess) => {

            this.wfc.invalidateProcess(action.payload.process.id);
            const processes = this.wfc.getProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();
            return new WpsDataUpdate({processes, products, graph});

        })
    );



    private wfc: WorkflowControl;

    constructor(
        private actions$: Actions,
        private store$: Store<State>,
        private httpClient: HttpClient,
        ) {
        // this.wfc = new WorkflowControl([], [], this.httpClient);
    }


    /**
     * @TODO: in the future, this will also load data from files with httpclient on the fly
     */
    private loadScenarioData(scenario: string): [Process[], Product[]] {
        let processes: Process[] = [];
        let products: Product[] = [];
        switch (scenario) {
            case 'c1':
                processes = [
                    ExposureModel,
                    VulnerabilityModel,
                    QuakeLedger,
                    EqSelection,
                    Shakyground,
                    Deus,
                    TsService,
                    PhysicalImpactAssessment
                ];
                products = [
                    lonmin, lonmax, latmin, latmax, assettype, schema, querymode, selectedRowsXml,
                    assetcategory, losscategory, taxonomies, buildingAndDamageClasses,
                    inputBoundingbox, mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
                    selectedEqs, userinputSelectedEq,
                    selectedEq, shakemapWmsOutput, shakemapOutput,
                    fragility, loss, damage, transition, updated_exposure,
                    lat, lon, mag, epicenter,
                    physicalImpact
                ];
                break;
            case 'e1':
                processes = [
                    LaharWps,
                    geomerHydrological
                ];
                products = [
                    direction, intensity, parameter, laharWms,
                    hydrologicalSimulation
                ];
                break;
            case 'p1':
                processes = [
                    QuakeLedgerPeru,
                    EqSelection,
                    Shakyground,
                    TsService
                ];
                products = [
                    inputBoundingboxPeru, mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
                    selectedEqs, userinputSelectedEq,
                    selectedEq, shakemapWmsOutput, shakemapOutput,
                    lat, lon, mag, epicenter
                ];
                break;
            default:
                throw new Error(`Unknown scenario ${scenario}`);
        }

        // @TODO: this feels bad. Is this a design mistake?
        const resetProducts = products.map(prod => {
            return {
                ...prod,
                value: null
            };
        });

        return [processes, resetProducts];
    }

}
