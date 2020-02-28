import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { RiesgosActions, ERiesgosActionTypes, ProductsProvided, ScenarioChosen,
        ClickRunProcess, RiesgosDataUpdate, RestartingFromProcess, RestaringScenario } from './riesgos.actions';
import { map, switchMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store, Action } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { WorkflowControl } from './riesgos.workflowcontrol';
import { QuakeLedger, InputBoundingbox, mmin, mmax, zmin,
        zmax, p, etype, tlon, tlat, selectedEqs } from '../configuration/chile/quakeledger';
import { InputBoundingboxPeru, QuakeLedgerPeru, etypePeru, tlonPeru, tlatPeru, mminPeru, mmaxPeru,
    zminPeru, zmaxPeru, pPeru, selectedEqsPeru } from '../configuration/peru/quakeledger';
import { Shakyground, shakemapWmsOutput, eqShakemapRef } from '../configuration/chile/shakyground';
import { TsService, tsWms, tsShakemap } from '../configuration/chile/tsService';
import { Process, Product } from './riesgos.datatypes';
import { direction, vei } from '../configuration/ecuador/lahar';
import { ExposureModel, lonmin, lonmax, latmin, latmax, initialExposure,
        assettype, schema, querymode, initialExposureRef } from '../configuration/chile/exposure';
import { VulnerabilityModel, assetcategory, losscategory, taxonomies, fragilityRef } from '../configuration/chile/modelProp';
import { selectedEq, EqSelection, userinputSelectedEq } from '../configuration/chile/eqselection';
import { hydrologicalSimulation, geomerFlood, durationTiff,
    velocityTiff, depthTiff, userinputSelectedOutburst,
    FloodMayRunProcess, FloodMayRun } from '../configuration/ecuador/geomerHydrological';
import { EqDeus, loss, eqDamageM, eqUpdatedExposureRef } from '../configuration/chile/eqDeus';
import { EqReliability, countryChile, hazardEq, damageConsumerAreas } from '../configuration/chile/reliability';
import { FlooddamageProcess, damageManzanas, damageBuildings, FlooddamageTranslator,
    damageManzanasGeojson } from '../configuration/ecuador/floodDamage';
import { DeusLaharAndAshfall, laharAshfallDamage, laharAshfallTransition,
    laharAshfallUpdatedExposure } from '../configuration/ecuador/laharAndAshDamage';
import { getScenarioRiesgosState } from './riesgos.selectors';
import { RiesgosScenarioState } from './riesgos.state';
import { Observable } from 'rxjs';
import { VeiProvider, selectableVei } from '../configuration/ecuador/vei';
import { AshfallService, ashfall, probability, ashfallPoint } from '../configuration/ecuador/ashfallService';
import { schemaEcuador, lonminEcuador, lonmaxEcuador, latminEcuador,
    latmaxEcuador, querymodeEcuador, assettypeEcuador, AshfallExposureModel, LaharExposureModel, initialExposureLahar, initialExposureLaharRef, initialExposureAshfall, initialExposureAshfallRef } from '../configuration/ecuador/exposure';
import { VulnerabilityModelEcuador, assetcategoryEcuador, losscategoryEcuador,
    taxonomiesEcuador } from '../configuration/ecuador/vulnerability';
import { LaharReliability, hazardLahar, countryEcuador, damageConsumerAreasEcuador } from '../configuration/ecuador/reliability';
import { lonminPeru, lonmaxPeru, latminPeru, latmaxPeru, assettypePeru, schemaPeru,
    querymodePeru, initialExposurePeru, ExposureModelPeru } from '../configuration/peru/exposure';
import { assetcategoryPeru, losscategoryPeru, taxonomiesPeru } from '../configuration/peru/modelProp';
import { TsServicePeru, tsWmsPeru, tsShakemapPeru } from '../configuration/peru/tsService';
import { EqSelectionPeru, userinputSelectedEqPeru, selectedEqPeru } from '../configuration/peru/eqselection';
import { shakemapWmsOutputPeru, eqShakemapRefPeru, ShakygroundPeru } from '../configuration/peru/shakyground';
import { lossPeru, eqDamagePeru, eqTransitionPeru, eqUpdatedExposurePeru,
    EqDeusPeru, eqUpdatedExposureRefPeru } from '../configuration/peru/eqDeus';
import { LaharWrapper, laharHeightWms, laharHeightShakemapRef,
    laharVelocityWms, laharVelocityShakemapRef, laharPressureWms,
    laharErosionWms, laharDepositionWms, laharContoursWms } from '../configuration/ecuador/laharWrapper';
import { ErrorParserService } from '../error-parser.service';
import { TsDeus, tsDamage, tsTransition, tsUpdatedExposure } from '../configuration/chile/tsDeus';
import { TsDeusPeru, tsDamagePeru, tsTransitionPeru, tsUpdatedExposurePeru } from '../configuration/peru/tsDeus';
import { EqReliabilityPeru, countryPeru, hazardEqPeru, damageConsumerAreasPeru } from '../configuration/peru/reliability';
import { DeusAshfall, ashfallDamage, ashfallTransition,
    ashfallUpdatedExposure, ashfallUpdatedExposureRef } from '../configuration/ecuador/ashfallDamage';
import { NewProcessClicked } from '../focus/focus.actions';
import { FakeEqReliabilityPeru } from '../configuration/peru/fakeReliability';
import { DeusLahar, DamageMayRunProcess, DamageMayRun, laharDamage, laharTransition, laharUpdatedExposure, laharUpdatedExposureRef } from '../configuration/ecuador/laharDamage';
import { ExposureSelection, modelChoice } from '../configuration/chile/exposureSelection';




@Injectable()
export class RiesgosEffects {

    @Effect()
    RestaringScenario$ = this.actions$.pipe(
        ofType<RiesgosActions>(ERiesgosActionTypes.restartingScenario),
        switchMap((action: RestaringScenario) => {

            const [procs, prods] = this.loadScenarioDataFresh(action.payload.scenario);

            this.wfc = new WorkflowControl(procs, prods, this.errorParser);
            const processes = this.wfc.getImmutableProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();

            const actions: Action[] = [
                new RiesgosDataUpdate({processes, products, graph}),
                new NewProcessClicked({processId: null})
            ];
            return actions;
        })
    );

    @Effect()
    scenarioChosen$ = this.actions$.pipe(
        ofType<RiesgosActions>(ERiesgosActionTypes.scenarioChosen),
        withLatestFrom(this.store$),
        switchMap(([action, state]: [ScenarioChosen, State]) => {

            const newScenario = action.payload.scenario;

            let procs: Process[];
            let prods: Product[];
            if (state.riesgosState.scenarioData[newScenario]) {
                let _;
                const scenarioData = state.riesgosState.scenarioData[newScenario];
                // because processes are more than the ImmutableProcesses stored in the state-store:
                prods = scenarioData.productValues; // getting products from state-store ...
                [procs, _] = this.loadScenarioDataFresh(action.payload.scenario); // ... but processes from registry.
            } else {
                [procs, prods] = this.loadScenarioDataFresh(action.payload.scenario);
            }

            this.wfc = new WorkflowControl(procs, prods, this.errorParser);
            const processes = this.wfc.getImmutableProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();

            const actions: Action[] = [new RiesgosDataUpdate({processes, products, graph})];
            return actions;
        })
    );

    @Effect()
    ProductsProvided = this.actions$.pipe(
        ofType<RiesgosActions>(ERiesgosActionTypes.productsProvided),
        map((action: ProductsProvided) => {

            for (const product of action.payload.products) {
                this.wfc.provideProduct(product.uid, product.value);
            }
            const processes = this.wfc.getImmutableProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();
            return new RiesgosDataUpdate({processes, products, graph});

        })
    );


    @Effect()
    runProcessClicked$ = this.actions$.pipe(
        ofType<RiesgosActions>(ERiesgosActionTypes.clickRunProduct),
        mergeMap((action: ClickRunProcess) =>  {

            const newProducts = action.payload.productsProvided;
            const process = action.payload.process;
            for (const prod of newProducts) {
                this.wfc.provideProduct(prod.uid, prod.value);
            }
            return this.wfc.execute(process.uid,
                (response, counter) => {
                    if (counter < 1) {
                        this.store$.dispatch(new RiesgosDataUpdate({
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
            const wpsUpdate = new RiesgosDataUpdate({processes, products, graph});
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
        ofType<RiesgosActions>(ERiesgosActionTypes.restartingFromProcess),
        map((action: RestartingFromProcess) => {

            this.wfc.invalidateProcess(action.payload.process.uid);
            const processes = this.wfc.getImmutableProcesses();
            const products = this.wfc.getProducts();
            const graph = this.wfc.getGraph();
            return new RiesgosDataUpdate({processes, products, graph});

        })
    );



    private wfc: WorkflowControl;

    constructor(
        private actions$: Actions,
        private store$: Store<State>,
        private httpClient: HttpClient,
        private errorParser: ErrorParserService
        ) {
    }


    private loadScenarioData(scenario: string): Observable<[Process[], Product[]]> {
        // @TODO: per default, load data from store.
        return this.store$.select(getScenarioRiesgosState, {scenario}).pipe(map((scenarioState: RiesgosScenarioState) => {
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
                    new ExposureSelection(this.httpClient),
                    new QuakeLedger(this.httpClient),
                    EqSelection,
                    new Shakyground(this.httpClient),
                    new EqDeus(this.httpClient),
                    new TsService(this.httpClient),
                    new TsDeus(this.httpClient),
                    new EqReliability(this.httpClient),
                    // PhysicalImpactAssessment
                ];
                products = [
                    modelChoice,
                    lonmin, lonmax, latmin, latmax, assettype, schema, querymode,
                    assetcategory, losscategory, taxonomies,
                    initialExposure,
                    new InputBoundingbox(), mmin, mmax, zmin, zmax, p, etype, tlon, tlat,
                    selectedEqs, userinputSelectedEq,
                    selectedEq, shakemapWmsOutput, eqShakemapRef,
                    loss, eqDamageM, eqUpdatedExposureRef,
                    tsWms, tsShakemap,
                    countryChile, hazardEq,
                    damageConsumerAreas,
                    tsDamage, tsTransition, tsUpdatedExposure,
                    // physicalImpact
                ];
                break;
            case 'p1':
                processes = [
                    new ExposureModelPeru(this.httpClient),
                    new QuakeLedgerPeru(this.httpClient),
                    EqSelectionPeru,
                    new ShakygroundPeru(this.httpClient),
                    new EqDeusPeru(this.httpClient),
                    new TsServicePeru(this.httpClient),
                    new TsDeusPeru(this.httpClient),
                    new EqReliabilityPeru(this.httpClient)
                ];
                products = [
                    lonminPeru, lonmaxPeru, latminPeru, latmaxPeru, assettypePeru, schemaPeru, querymodePeru,
                    assetcategoryPeru, losscategoryPeru, taxonomiesPeru,
                    initialExposurePeru,
                    new InputBoundingboxPeru(), mminPeru, mmaxPeru, zminPeru, zmaxPeru, pPeru, etypePeru, tlonPeru, tlatPeru,
                    lossPeru, eqDamagePeru, eqTransitionPeru, eqUpdatedExposurePeru,
                    selectedEqsPeru, userinputSelectedEqPeru,
                    selectedEqPeru, shakemapWmsOutputPeru, eqShakemapRefPeru,
                    tsWmsPeru, tsShakemapPeru, eqUpdatedExposureRefPeru,
                    tsDamagePeru, tsTransitionPeru, tsUpdatedExposurePeru,
                    countryPeru, hazardEqPeru,
                    damageConsumerAreasPeru
                ];
                break;
            case 'e1':
                processes = [
                    VeiProvider,

                    new AshfallService(this.httpClient),
                    new AshfallExposureModel(this.httpClient),
                    new DeusAshfall(this.httpClient),

                    new LaharWrapper(this.httpClient),
                    new LaharExposureModel(this.httpClient),
                    new DeusLahar(this.httpClient),


                    new DeusLaharAndAshfall(this.httpClient),
                    new LaharReliability(this.httpClient),

                    FloodMayRunProcess,
                    geomerFlood,
                    new FlooddamageProcess(this.httpClient),
                    FlooddamageTranslator
                ];
                products = [
                    schemaEcuador, lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, assettypeEcuador,
                    fragilityRef, initialExposureAshfall, initialExposureAshfallRef, initialExposureLahar, initialExposureLaharRef,
                    selectableVei, vei, FloodMayRun,
                    probability, ashfall, ashfallPoint,
                    ashfallDamage, ashfallTransition, ashfallUpdatedExposure, ashfallUpdatedExposureRef,
                    direction, laharHeightWms, laharHeightShakemapRef, laharVelocityWms, laharVelocityShakemapRef,
                    laharPressureWms, laharErosionWms, laharDepositionWms, laharContoursWms,
                    assetcategoryEcuador, losscategoryEcuador, taxonomiesEcuador,
                    laharDamage, laharTransition, laharUpdatedExposure, laharUpdatedExposureRef,
                    laharAshfallDamage, laharAshfallTransition, laharAshfallUpdatedExposure,
                    countryEcuador, hazardLahar,
                    damageConsumerAreasEcuador,
                    userinputSelectedOutburst, hydrologicalSimulation, durationTiff, velocityTiff, depthTiff,
                    damageManzanas, damageBuildings,
                    damageManzanasGeojson
                ];
                break;
            default:
                throw new Error(`Unknown scenario ${scenario}`);
        }

        return [processes, products];
    }

}
