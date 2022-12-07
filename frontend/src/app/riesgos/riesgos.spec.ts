import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, ActionReducerMap, ActionsSubject, ReducerManager, StateObservable, Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { API_ScenarioInfo, API_ScenarioState, BackendService } from '../services/backend/backend.service';
import * as RiesgosActions from './riesgos.actions';
import { RiesgosEffects } from './riesgos.effects';
import { initialRiesgosState, RiesgosState } from './riesgos.state';
import { reducer as riesgosReducer } from './riesgos.reducers';
import { getScenarioRiesgosState, getCurrentScenarioName } from './riesgos.selectors';
import { AppComponent } from '../app.component';
import { delay, tap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';


/**
 * 
 * @TODO: might be better off using marble-diagrams for this kind of time-senstive tests:
 * https://rxjs.dev/guide/testing/marble-testing
 * 
 */


class MockBackendService extends BackendService {
    constructor() {
        super(null, null);
    }

    loadScenarios(): Observable<API_ScenarioInfo[]> {
        const scenarios: API_ScenarioInfo[] = [{
            "id": "Chile",
            "description": "Chile Scenario Description",
            "steps": [{ "id": "EqsChile", "title": "quakeledger", "description": "QuakeLedgerDescription", "inputs": [{ "id": "eqCatalogTypeChile", "options": ["expert"] }], "outputs": [{ "id": "availableEqsChile" }] }, { "id": "SelectEqChile", "title": "Select earthquake", "description": "select_eq_description", "inputs": [{ "id": "availableEqsChile" }, { "id": "userChoiceChile", "options": [] }], "outputs": [{ "id": "selectedEqChile" }] }, { "id": "EqSimulationChile", "title": "Earthquake Simulation", "description": "EqSimulationShortText", "inputs": [{ "id": "selectedEqChile" }, { "id": "gmpeChile", "options": ["MontalvaEtAl2016SInter", "GhofraniAtkinson2014", "AbrahamsonEtAl2015SInter", "YoungsEtAl1997SInterNSHMP2008"] }, { "id": "vsgridChile", "options": ["USGSSlopeBasedTopographyProxy", "FromSeismogeotechnicsMicrozonation"] }], "outputs": [{ "id": "eqSimWmsChile" }, { "id": "eqSimXmlRefChile" }] }, { "id": "ExposureChile", "title": "Exposure", "description": "Picks exposure model", "inputs": [{ "id": "exposureModelNameChile", "options": ["ValpCVTBayesian", "ValpCommuna", "ValpRegularOriginal", "ValpRegularGrid"] }], "outputs": [{ "id": "exposureChile" }, { "id": "exposureRefChile" }] }, { "id": "EqDamageChile", "title": "Multihazard_damage_estimation/Earthquake", "description": "eq_damage_svc_description", "inputs": [{ "id": "eqSimXmlRefChile" }, { "id": "exposureRefChile" }], "outputs": [{ "id": "eqDamageWmsChile" }, { "id": "eqDamageSummaryChile" }, { "id": "eqDamageRefChile" }] }, { "id": "TsunamiChile", "title": "TS-Service", "description": "TsShortDescription", "inputs": [{ "id": "selectedEqChile" }], "outputs": [{ "id": "tsWmsChile" }] }, { "id": "TsDamageChile", "title": "Multihazard_damage_estimation/Tsunami", "description": "ts_damage_svc_description", "inputs": [{ "id": "schemaTsChile", "options": ["Medina_2019", "SUPPASRI2013_v2.0"] }, { "id": "tsWmsChile" }, { "id": "eqDamageRefChile" }], "outputs": [{ "id": "tsDamageWmsChile" }, { "id": "tsDamageSummaryChile" }] }, { "id": "damageConsumerAreasChile", "title": "System reliability after EQ", "description": "Description_system_reliability", "inputs": [{ "id": "eqSimXmlRefChile" }], "outputs": [{ "id": "damageConsumerAreasChile" }] }]
        }, {
            "id": "Ecuador",
            "description": "Ecuador Scenario Description",
            "steps": [{ "id": "VeiSelection", "title": "VEI Selection", "description": "VEI_description", "inputs": [{ "id": "veiUserSelection", "options": ["VEI1", "VEI2", "VEI3", "VEI4"] }], "outputs": [{ "id": "vei" }] }, { "id": "Ashfall", "title": "AshfallService", "description": "AshfallServiceDescription", "inputs": [{ "id": "vei" }, { "id": "ashfallProb", "options": ["1", "50", "99"] }], "outputs": [{ "id": "ashfallVectors" }, { "id": "ashfallPoints" }] }, { "id": "AshfallExposureEcuador", "title": "Ashfall exposure model", "description": "ashfall_exposure_process_description", "inputs": [], "outputs": [{ "id": "ashfallExposureEcuador" }, { "id": "ashfallExposureEcuadorRef" }] }, { "id": "AshfallDamage", "title": "Ashfall Damage", "description": "ashfall_damage_service_description", "inputs": [{ "id": "ashfallPoints" }, { "id": "ashfallExposureEcuadorRef" }], "outputs": [{ "id": "ashfallDamage" }, { "id": "ashfallDamageRef" }] }, { "id": "LaharSim", "title": "LaharService", "description": "Process_description_lahar_simulation", "inputs": [{ "id": "vei" }, { "id": "direction", "options": ["North", "South"] }], "outputs": [{ "id": "laharWmses" }, { "id": "laharShakemapRefs" }] }, { "id": "LaharExposureEcuador", "title": "Lahar exposure model", "description": "lahar_exposure_process_description", "inputs": [], "outputs": [{ "id": "laharExposureEcuador" }, { "id": "laharExposureEcuadorRef" }] }, { "id": "LaharDamage", "title": "Lahar Damage", "description": "lahar_damage_service_description", "inputs": [{ "id": "laharShakemapRefs" }, { "id": "laharExposureEcuadorRef" }], "outputs": [{ "id": "laharDamage" }, { "id": "laharDamageRef" }] }, { "id": "CombinedDamageEcuador", "title": "LaharAndAshfallDamage", "description": "ashfall_and_lahar_damage_service_description", "inputs": [{ "id": "laharShakemapRefs" }, { "id": "ashfallDamageRef" }, { "id": "ashfallDamage" }], "outputs": [{ "id": "combinedDamageEcuador" }] }, { "id": "SystemReliabilityEcuador", "title": "System reliability after Lahar", "description": "Description_system_reliability", "inputs": [{ "id": "laharShakemapRefs" }], "outputs": [{ "id": "sysrelEcuador" }] }]
        }, {
            "id": "Peru",
            "description": "Peru Scenario Description",
            "steps": [{ "id": "Eqs", "title": "quakeledger", "description": "QuakeLedgerDescription", "inputs": [{ "id": "eqCatalogType", "options": ["observed", "expert"] }], "outputs": [{ "id": "availableEqs" }] }, { "id": "selectEq", "title": "Select earthquake", "description": "select_eq_description", "inputs": [{ "id": "availableEqs" }, { "id": "userChoice", "options": [] }], "outputs": [{ "id": "selectedEq" }] }, { "id": "EqSimulation", "title": "Earthquake Simulation", "description": "EqSimulationShortText", "inputs": [{ "id": "selectedEq" }, { "id": "gmpe", "options": ["MontalvaEtAl2016SInter", "GhofraniAtkinson2014", "AbrahamsonEtAl2015SInter", "YoungsEtAl1997SInterNSHMP2008"] }, { "id": "vsgrid", "options": ["USGSSlopeBasedTopographyProxy", "FromSeismogeotechnicsMicrozonation"] }], "outputs": [{ "id": "eqSimWms" }, { "id": "eqSimXmlRef" }] }, { "id": "Exposure", "title": "Exposure", "description": "Picks exposure model", "inputs": [{ "id": "exposureModelName", "options": ["LimaCVT1_PD30_TI70_5000", "LimaCVT2_PD30_TI70_10000", "LimaCVT3_PD30_TI70_50000", "LimaCVT4_PD40_TI60_5000", "LimaCVT5_PD40_TI60_10000", "LimaCVT6_PD40_TI60_50000", "LimaBlocks"] }], "outputs": [{ "id": "exposure" }, { "id": "exposureRef" }] }, { "id": "EqDamage", "title": "Multihazard_damage_estimation/Earthquake", "description": "eq_damage_svc_description", "inputs": [{ "id": "eqSimXmlRef" }, { "id": "exposureRef" }], "outputs": [{ "id": "eqDamageWms" }, { "id": "eqDamageSummary" }, { "id": "eqDamageRef" }] }, { "id": "Tsunami", "title": "TS-Service", "description": "TsShortDescription", "inputs": [{ "id": "selectedEq" }], "outputs": [{ "id": "tsWms" }] }, { "id": "TsDamage", "title": "Multihazard_damage_estimation/Tsunami", "description": "ts_damage_svc_description", "inputs": [{ "id": "schemaTs", "options": ["Medina_2019", "SUPPASRI2013_v2.0"] }, { "id": "tsWms" }, { "id": "eqDamageRef" }], "outputs": [{ "id": "tsDamageWms" }, { "id": "tsDamageSummary" }] }, { "id": "SysRel", "title": "System reliability after EQ", "description": "Description_system_reliability", "inputs": [{ "id": "eqSimXmlRef" }], "outputs": [{ "id": "sysRel" }] }]
        }];

        return of(scenarios).pipe(delay(1000));
    }

    execute(scenarioId: string, stepId: string, state: API_ScenarioState): Observable<API_ScenarioState> {
        const response: API_ScenarioState = {
            data: []
        };
        return of(response).pipe(delay(1000));
    }
}


fdescribe('Unit-testing riesgos/redux', () => {

    const initialState = {
        riesgosState: initialRiesgosState
    };
    const reducers: ActionReducerMap<{ riesgosState: RiesgosState }> = {
        riesgosState: riesgosReducer
    }

    let store: Store;
    let testScheduler: TestScheduler;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot(reducers, { initialState })],
            providers: [{ provide: BackendService, useValue: new MockBackendService() }]
          });
          store = TestBed.inject(Store);
          testScheduler = new TestScheduler((actual, expected) => {
            return expect(actual).toEqual(expected);
          });
    });


    it('should give a valid store', (done) => {
        store.select(getScenarioRiesgosState(initialRiesgosState.currentScenario)).subscribe(state => {
            expect(state).toBeTruthy();
            expect(state.scenario).toBe(initialRiesgosState.currentScenario);
            done();
        });
    });


    it('should react to actions', (done) => {
        let t = 0;
        store.select(getCurrentScenarioName).subscribe(scenarioName => {
            t += 1;
            expect(scenarioName).toBeTruthy();
            if (t === 1) expect(scenarioName).toBe(initialRiesgosState.currentScenario);
            if (t === 2) expect(scenarioName).toBe('Ecuador');
            if (t === 2) done();
        });
        store.dispatch(RiesgosActions.scenarioChosen({ scenario: 'Ecuador' }));
    });


    it('should work with delayed data', () => { 
        // https://betterprogramming.pub/rxjs-testing-write-unit-tests-for-observables-603af959e251
        // https://rxjs.dev/guide/testing/marble-testing

        testScheduler.run(({ expectObservable, cold}) => {
            // now inside a synchronous scope


            // expecting initial state to be set
            const expectedMarbles = 'p';
            const expectedValues = {
                p: 'Peru'
            };
            const getScenarioName$ = store.select(getCurrentScenarioName);
            expectObservable(getScenarioName$).toBe(expectedMarbles, expectedValues);




            // expecting state to be set correctly after async updates
            const triggerMarbles = '---e---c---p';
            const triggerValues = {
                e: store.dispatch(RiesgosActions.scenarioChosen({ scenario: 'Ecuador' })),
                c: store.dispatch(RiesgosActions.scenarioChosen({ scenario: 'Chile' })),
                p: store.dispatch(RiesgosActions.scenarioChosen({ scenario: 'Peru' })),
            }
            const actions$ = cold(triggerMarbles, triggerValues);
            const expectedMarbles2 = 'p---e---c---p';
            const expectedValues2 = {
                e: 'Ecuador',
                c: 'Chile',
                p: 'Peru'
            }

            expectObservable(getScenarioName$).toBe(expectedMarbles2, expectedValues2);
            expectObservable(actions$.pipe(tap(fn => fn())));

            // leaving synchronous scope
        });
    });


    it('should maintain correct state with two parallel, long running processes', () => {
    });


    it('should maintain correct state with two parallel, long running processes, even if one errors out', () => {
    });

});



describe('Integration-testing riesgos/redux', () => {

    let fixture: ComponentFixture<AppComponent>;
    let component;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [
                HttpClientTestingModule,
                StoreModule.forRoot({
                    riesgos: riesgosReducer,
                }),
            ],
            providers: [MockBackendService],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.debugElement.componentInstance;

        fixture.detectChanges();
    });


    it('should build', () => {
        expect(component).toBeTruthy();
    })
});
