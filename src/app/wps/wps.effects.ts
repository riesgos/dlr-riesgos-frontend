import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { WpsActions, EWpsActionTypes, ProductsProvided, ScenarioChosen,
        ClickRunProcess, WpsDataUpdate, RestartingFromProcess, RestaringScenario } from './wps.actions';
import { map, switchMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { WorkflowControl } from './wps.workflowcontrol';
import { QuakeLedger, InputBoundingbox, mmin, mmax, zmin,
        zmax, p, etype, tlon, tlat, selectedEqs } from '../configuration/chile/quakeledger';
import { InputBoundingboxPeru, QuakeLedgerPeru, etypePeru, tlonPeru, tlatPeru, mminPeru, mmaxPeru,
    zminPeru, zmaxPeru, pPeru, selectedEqsPeru } from '../configuration/peru/quakeledger';
import { Shakyground, shakemapWmsOutput, shakemapXmlRefOutput } from '../configuration/chile/shakyground';
import { TsService, tsWms, tsShakemap } from '../configuration/chile/tsService';
import { Process, Product } from './wps.datatypes';
import { LaharWps, direction, laharWms, vei, parameter, laharShakemap } from '../configuration/ecuador/lahar';
import { ExposureModel, lonmin, lonmax, latmin, latmax, exposureRef,
        assettype, schema, querymode } from '../configuration/chile/exposure';
import { VulnerabilityModel, assetcategory, losscategory, taxonomies, fragilityRef } from '../configuration/chile/modelProp';
import { selectedEq, EqSelection, userinputSelectedEq } from '../configuration/chile/eqselection';
import { hydrologicalSimulation, geomerFlood, durationTiff,
    velocityTiff, depthTiff, geomerFloodWcsProvider } from '../configuration/ecuador/geomerHydrological';
import { EqDeus, loss, eqDamage, eqTransition, eqUpdatedExposure } from '../configuration/chile/eqDeus';
import { EqReliability, countryChile, hazardEq, damageConsumerAreas } from '../configuration/chile/reliability';
import { FlooddamageProcess, damageManzanas, damageBuildings, FlooddamageTranslator,
    damageManzanasGeojson } from '../configuration/ecuador/floodDamage';
import { laharTransition, LaharDeus, laharDamage,
    laharUpdatedExposure  } from '../configuration/ecuador/laharDamage';
import { FakeDeus } from '../configuration/others/fakeDeus';
import { VulnerabilityAndExposure } from '../configuration/chile/vulnAndExpCombined';
import { getScenarioWpsState } from './wps.selectors';
import { WpsScenarioState } from './wps.state';
import { Observable } from 'rxjs';
import { VeiProvider, selectableVei } from '../configuration/ecuador/vei';
import { AshfallService, ashfall, probability, AshfallTranslator, ashfallVei } from '../configuration/ecuador/ashfall';
import { LaharExposureModel, schemaEcuador, lonminEcuador, lonmaxEcuador, latminEcuador,
    latmaxEcuador, querymodeEcuador, assettypeEcuador } from '../configuration/ecuador/exposure';
import { LaharVulnerabilityModel, assetcategoryEcuador, losscategoryEcuador,
    taxonomiesEcuador } from '../configuration/ecuador/vulnerability';
import { LaharReliability, hazardLahar, countryEcuador, damageConsumerAreasEcuador } from '../configuration/ecuador/reliability';
import { lonminPeru, lonmaxPeru, latminPeru, latmaxPeru, assettypePeru, schemaPeru,
    querymodePeru, exposureRefPeru } from '../configuration/peru/exposure';
import { VulnerabilityAndExposurePeru } from '../configuration/peru/vulnAndExpCombined';
import { assetcategoryPeru, losscategoryPeru, taxonomiesPeru, fragilityRefPeru } from '../configuration/peru/modelProp';
import { TsServicePeru, tsWmsPeru, tsShakemapPeru } from '../configuration/peru/tsService';
import { EqSelectionPeru, userinputSelectedEqPeru, selectedEqPeru } from '../configuration/peru/eqselection';
import { shakemapWmsOutputPeru, shakemapXmlRefOutputPeru, ShakygroundPeru } from '../configuration/peru/shakyground';
import { FakeDeusPeru } from '../configuration/peru/fakeDeus';
import { lossPeru, eqDamagePeru, eqTransitionPeru, eqUpdatedExposurePeru, EqDeusPeru } from '../configuration/peru/eqDeus';




@Injectable()
export class WpsEffects {

    @Effect()
    RestaringScenario$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.restartingScenario),
        switchMap((action: RestaringScenario) => {

            const [procs, prods] = this.loadScenarioDataFresh(action.payload.scenario);

            this.wfc = new WorkflowControl(procs, prods);
            const processes = this.wfc.getImmutableProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();

            const actions: Action[] = [new WpsDataUpdate({processes, products, graph})];
            return actions;
        })
    );

    @Effect()
    scenarioChosen$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.scenarioChosen),
        withLatestFrom(this.store$),
        switchMap(([action, state]: [ScenarioChosen, State]) => {

            const newScenario = action.payload.scenario;

            let procs: Process[];
            let prods: Product[];
            if (state.wpsState.scenarioData[newScenario]) {
                let _;
                const scenarioData = state.wpsState.scenarioData[newScenario];
                // because processes are more than the ImmutableProcesses stored in the state-store: 
                prods = scenarioData.productValues; // getting products from state-store ...
                [procs, _] = this.loadScenarioDataFresh(action.payload.scenario); // ... but processes from registry.
            } else {
                [procs, prods] = this.loadScenarioDataFresh(action.payload.scenario);
            }

            this.wfc = new WorkflowControl(procs, prods);
            const processes = this.wfc.getImmutableProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();

            const actions: Action[] = [new WpsDataUpdate({processes, products, graph})];
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
            const processes = this.wfc.getImmutableProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();
            return new WpsDataUpdate({processes, products, graph});

        })
    );


    @Effect()
    runProcessClicked$ = this.actions$.pipe(
        ofType<WpsActions>(EWpsActionTypes.clickRunProduct),
        mergeMap((action: ClickRunProcess) =>  {

            const newProducts = action.payload.productsProvided;
            const process = action.payload.process;
            for (const prod of newProducts) {
                this.wfc.provideProduct(prod.uid, prod.value);
            }
            return this.wfc.execute(process.uid,
                (response, counter) => {
                    if (counter < 1) {
                        this.store$.dispatch(new WpsDataUpdate({
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

            this.wfc.invalidateProcess(action.payload.process.uid);
            const processes = this.wfc.getImmutableProcesses();
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
    }


    private loadScenarioData(scenario: string): Observable<[Process[], Product[]]> {
        // @TODO: per default, load data from store.
        return this.store$.select(getScenarioWpsState, {scenario}).pipe(map((scenarioState: WpsScenarioState) => {
            if (scenarioState) {
                return [scenarioState.processStates, scenarioState.productValues];
            } else {
                return this.loadScenarioDataFresh(scenario);
            }
        }));
    }


    private loadScenarioDataFresh(scenario: string): [Process[], Product[]] {
        let processes: Process[] = [];
        let products: Product[] = [];
        switch (scenario) {
            case 'c1':
                processes = [
                    new VulnerabilityAndExposure(this.httpClient),
                    new QuakeLedger(this.httpClient),
                    EqSelection,
                    new Shakyground(this.httpClient),
                    // EqDeus,
                    new FakeDeus(this.httpClient),
                    new TsService(this.httpClient),
                    // TsDeus,
                    new EqReliability(this.httpClient),
                    // PhysicalImpactAssessment
                ];
                products = [
                    lonmin, lonmax, latmin, latmax, assettype, schema, querymode,
                    assetcategory, losscategory, taxonomies,
                    exposureRef, fragilityRef,
                    new InputBoundingbox(), mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
                    selectedEqs, userinputSelectedEq,
                    selectedEq, shakemapWmsOutput, shakemapXmlRefOutput,
                    loss, eqDamage, eqTransition, eqUpdatedExposure,
                    tsWms, tsShakemap,
                    countryChile, hazardEq,
                    damageConsumerAreas,
                    // tsDamage, tsTransition, tsUpdatedExposure,
                    // physicalImpact
                ];
                break;
            case 'p1':
                processes = [
                    new VulnerabilityAndExposurePeru(this.httpClient),
                    new QuakeLedgerPeru(this.httpClient),
                    EqSelectionPeru,
                    new ShakygroundPeru(this.httpClient),
                    new EqDeusPeru(this.httpClient),
                    // new FakeDeusPeru(this.httpClient),
                    new TsServicePeru(this.httpClient),
                    // Reliability
                ];
                products = [
                    lonminPeru, lonmaxPeru, latminPeru, latmaxPeru, assettypePeru, schemaPeru, querymodePeru,
                    assetcategoryPeru, losscategoryPeru, taxonomiesPeru,
                    fragilityRefPeru, exposureRefPeru,
                    new InputBoundingboxPeru(), mminPeru, mmaxPeru, zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru,
                    lossPeru, eqDamagePeru, eqTransitionPeru, eqUpdatedExposurePeru,
                    selectedEqsPeru, userinputSelectedEqPeru,
                    selectedEqPeru, shakemapWmsOutputPeru, shakemapXmlRefOutputPeru,
                    // country, hazard,
                    tsWmsPeru, tsShakemapPeru,
                    // damage_consumer_areas
                ];
                break;
            case 'e1':
                processes = [
                    VeiProvider,
                    new LaharWps(this.httpClient),
                    AshfallTranslator,
                    new AshfallService(this.httpClient),
                    new LaharVulnerabilityModel(this.httpClient),
                    new LaharExposureModel(this.httpClient),
                    new LaharDeus(this.httpClient),
                    new LaharReliability(this.httpClient),
                    geomerFlood,
                    geomerFloodWcsProvider,
                    new FlooddamageProcess(this.httpClient),
                    FlooddamageTranslator
                ];
                products = [
                    selectableVei, vei, probability, ashfallVei,
                    ashfall,
                    direction, parameter, laharWms, laharShakemap,
                    schemaEcuador, lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, assettypeEcuador,
                    assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador,
                    fragilityRef, exposureRef,
                    laharDamage, laharTransition, laharUpdatedExposure,
                    countryEcuador, hazardLahar,
                    hydrologicalSimulation,
                    damageConsumerAreasEcuador,
                    durationTiff, velocityTiff, depthTiff, damageManzanas, damageBuildings,
                    damageManzanasGeojson
                ];
                break;
            default:
                throw new Error(`Unknown scenario ${scenario}`);
        }

        return [processes, products];
    }

}
