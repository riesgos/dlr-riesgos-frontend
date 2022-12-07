import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Actions, EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, ActionReducerMap, ActionsSubject, ReducerManager, StateObservable, Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { API_ScenarioInfo, API_ScenarioState, BackendService } from '../services/backend/backend.service';
import * as RiesgosActions from './riesgos.actions';
import * as FocusActions from '../focus/focus.actions';
import { RiesgosEffects } from './riesgos.effects';
import { initialRiesgosState, RiesgosState, StepStateAvailable, StepStateRunning } from './riesgos.state';
import { reducer as riesgosReducer } from './riesgos.reducers';
import { getScenarioRiesgosState, getCurrentScenarioName, getCurrentScenarioRiesgosState } from './riesgos.selectors';
import { AppComponent } from '../app.component';
import { delay, tap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';



class MockBackendService extends BackendService {
    constructor() {
        super(null, null);
    }

    loadScenarios(): Observable<API_ScenarioInfo[]> {
        console.log('Mock backend service: loading scenarios ...');
        const scenarios: API_ScenarioInfo[] = [{
            "id": "Chile",
            "description": "Chile Scenario Description",
            "steps": []
        }, {
            "id": "Ecuador",
            "description": "Ecuador Scenario Description",
            "steps": [
                { "id": "LaharExposureEcuador",     "title": "", "description": "", "inputs": [], "outputs": [{ "id": "laharExposureEcuador" }] },
                { "id": "AshfallExposureEcuador",   "title": "", "description": "", "inputs": [], "outputs": [{ "id": "ashfallExposureEcuador" }] },
            ]
        }, {
            "id": "Peru",
            "description": "Peru Scenario Description",
            "steps": []
        }];

        return of(scenarios).pipe(delay(100));
    }

    execute(scenarioId: string, stepId: string, state: API_ScenarioState): Observable<API_ScenarioState> {
        console.log('Mock backend service: executing: ', scenarioId, stepId, state);
        const response: API_ScenarioState = {
            data: []
        };
        return of(response).pipe(delay(100));
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
            imports: [
                StoreModule.forRoot(reducers, { initialState }),
                EffectsModule.forRoot([RiesgosEffects]),
            ],
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

        /**
            Length of frames (i.e., number of emitted items unexpected)
                Expected $.length = 1 to equal 2.
            Number of frame (i.e., the expected time frame is unexpected)
                Expected $[0].frame = 0 to equal 10.
            Kind of frame (i.e., item, completion, error, subscription, unsubscription)
                Expected $[0].notification.kind = 'C' to equal 'N'.
                    N = Emitted item
                    C = Completion
                    E = Error
            Frame value (i.e., emitted item value or error message)
                Expected $[0].notification.value = undefined to equal 'tomatoes eat humans'.
         */

        testScheduler.run(({ expectObservable, cold}) => {
            // now inside a synchronous scope
            
            const getScenarioName$ = store.select(getCurrentScenarioName); // .pipe(tap(n => console.log(n)));

            // expecting state to be set correctly after async updates
            const triggerMarbles = '---e---c---p';
            const triggerValues = {
                e: () => store.dispatch(RiesgosActions.scenarioChosen({ scenario: 'Ecuador' })),
                c: () => store.dispatch(RiesgosActions.scenarioChosen({ scenario: 'Chile' })),
                p: () => store.dispatch(RiesgosActions.scenarioChosen({ scenario: 'Peru' })),
            }
            const actions$ = cold(triggerMarbles, triggerValues);
            const expectedMarbles2 = 'p--e---c---p';
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

        testScheduler.run(({ expectObservable, cold}) => {
            
            const getState$ = store.select(getCurrentScenarioRiesgosState); // .pipe(tap(n => console.log(n)));

            const triggerMarbles = 'i 150ms e---l--a';
            const triggerValues = {
                i: () => store.dispatch(FocusActions.appInit()),
                e: () => store.dispatch(RiesgosActions.scenarioChosen({ scenario: 'Ecuador' })),
                l: () => store.dispatch(RiesgosActions.executeStart({ scenario: 'Ecuador', step: 'LaharExposureEcuador' })),
                a: () => store.dispatch(RiesgosActions.executeStart({ scenario: 'Ecuador', step: 'AshfallExposureEcuador' })),
            }
            const actions$ = cold(triggerMarbles, triggerValues);


            const expectedMarbles = 'init 99ms s 50ms e---l--a';
            const expectedValues = {
                init: { scenario: 'Peru', products: [], steps: [] },
                s: { scenario: 'Peru', products: [], steps: [] },
                e: { 
                    scenario: 'Ecuador', 
                    products: [{id: 'laharExposureEcuador'}, {id: 'ashfallExposureEcuador'}], 
                    steps: [
                        {step: { "id": "LaharExposureEcuador",     "title": "", "description": "", "inputs": [], "outputs": [{ "id": "laharExposureEcuador" }] },   state: new StepStateAvailable() },
                        {step: { "id": "AshfallExposureEcuador",   "title": "", "description": "", "inputs": [], "outputs": [{ "id": "ashfallExposureEcuador" }] }, state: new StepStateAvailable() },
                    ]
                },
                l: { 
                    scenario: 'Ecuador', 
                    products: [{id: 'laharExposureEcuador'}, {id: 'ashfallExposureEcuador'}], 
                    steps: [
                        {step: { "id": "LaharExposureEcuador",     "title": "", "description": "", "inputs": [], "outputs": [{ "id": "laharExposureEcuador" }] },   state: new StepStateRunning() },
                        {step: { "id": "AshfallExposureEcuador",   "title": "", "description": "", "inputs": [], "outputs": [{ "id": "ashfallExposureEcuador" }] }, state: new StepStateAvailable() },
                    ]
                },
                a: { 
                    scenario: 'Ecuador', 
                    products: [{id: 'laharExposureEcuador'}, {id: 'ashfallExposureEcuador'}], 
                    steps: [
                        {step: { "id": "LaharExposureEcuador",     "title": "", "description": "", "inputs": [], "outputs": [{ "id": "laharExposureEcuador" }] },   state: new StepStateRunning() },
                        {step: { "id": "AshfallExposureEcuador",   "title": "", "description": "", "inputs": [], "outputs": [{ "id": "ashfallExposureEcuador" }] }, state: new StepStateRunning() },
                    ]
                },
            }


            expectObservable(getState$).toBe(expectedMarbles, expectedValues);
            expectObservable(actions$.pipe(tap(fn => fn())));

            // leaving synchronous scope
        });

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
