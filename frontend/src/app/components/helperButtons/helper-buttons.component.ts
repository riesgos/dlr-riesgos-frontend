import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getCurrentScenarioRiesgosState } from 'src/app/riesgos/riesgos.selectors';
import { RiesgosScenarioState, isRiesgosScenarioState } from 'src/app/riesgos/riesgos.state';
import * as RiesgosActions from 'src/app/riesgos/riesgos.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { downloadJson, parseFile } from 'src/app/helpers/others';
import { map, tap } from 'rxjs/operators';
import { createGraph } from 'src/app/riesgos/riesgos.workflowcontrol';



@Component({
    selector: 'ukis-helper-buttons',
    templateUrl: './helper-buttons.component.html',
    styleUrls: ['./helper-buttons.component.scss']
})
export class HelperButtonsComponent implements OnInit {

    showResetModal = false;
    showRestoreModal = false;
    showStoreModal = false;
    nameControl: UntypedFormControl;
    dropFieldText$: BehaviorSubject<string>;
    stateToBeRestored$: BehaviorSubject<RiesgosScenarioState>;
    private currentState: RiesgosScenarioState;

    constructor(
        private store: Store<State>
    ) {
        this.nameControl = new UntypedFormControl('Save state', [Validators.required, noSpecialChars]);
    }

    ngOnInit() {
        this.store.pipe(select(getCurrentScenarioRiesgosState)).subscribe((state: RiesgosScenarioState) => {
            this.currentState = state;
        });
        this.dropFieldText$ = new BehaviorSubject<string>('Drop your file here!');
        this.stateToBeRestored$ = new BehaviorSubject<RiesgosScenarioState>(null);
    }

    saveState(): void {
        const name = this.nameControl.value;
        const data = this.currentState;
        downloadJson(data, name + '.json');
        this.showStoreModal = false;
    }

    onResetClicked(): void {
        const currentScenario = this.currentState.scenario;
        this.store.dispatch(RiesgosActions.restartingScenario({scenario: currentScenario}));
        this.showResetModal = false;
    }

    restoreState(): void {
        const stateToRestore: RiesgosScenarioState = this.stateToBeRestored$.value;
        // @TODO: instead of just a ProductsProvided action,
        // create a new action that validates that all data is still there on the remote servers.
        this.store.dispatch(RiesgosActions.executeSuccess({
            products: stateToRestore.productValues.filter(pv => pv.value !== null)
        }));

        // Don't do a RiesgosDataUpdate here!
        // RiesgosDataUpdate is intended to be used only from riesgos.effects.ts
        // If you call RiesgosDataUpdate directly, WFC will not be updated.
        // Also, the map will not display your loaded products.
        // this.store.dispatch(new RiesgosDataUpdate({
        //     processes: stateToRestore.processStates,
        //     products: stateToRestore.productValues,
        //     graph: stateToRestore.graph
        // }))
        this.showRestoreModal = false;
    }

    cancelRestoreState(): void {
        this.stateToBeRestored$.next(null);
        this.dropFieldText$.next(null);
        this.showRestoreModal = false;
    }

    fileDropped(files: FileList) {
        const file = files[0];
        this.extractSaveState(file).subscribe((state: RiesgosScenarioState) => {
            this.dropFieldText$.next(file.name);
            this.stateToBeRestored$.next(state);
        });
    }

    private extractSaveState(file: File): Observable<RiesgosScenarioState> {
        const state$ = parseFile(file).pipe(
            map((content: string) => JSON.parse(content)),
            map((state: RiesgosScenarioState) => {
                return {
                    ... state,
                    // the graph can only be saved as a flat structure without functions
                    // this is to restore its full capabilities
                    graph: createGraph(state.stepStates)
                };
            }),
            tap((result: RiesgosScenarioState) => {
                if (!isRiesgosScenarioState(result)) {
                    throw Error(`The file ${file.name} did not contain a valid RiesgosScenarioState`);
                }
            })
        );
        return state$;
    }

}


function noSpecialChars(control: UntypedFormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidName: true };
    }
}
