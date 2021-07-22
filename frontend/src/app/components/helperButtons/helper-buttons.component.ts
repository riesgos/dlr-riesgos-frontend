import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getCurrentScenarioRiesgosState } from 'src/app/riesgos/riesgos.selectors';
import { RiesgosScenarioState, isRiesgosScenarioState } from 'src/app/riesgos/riesgos.state';
import { RestaringScenario, ProductsProvided } from 'src/app/riesgos/riesgos.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { downloadJson, parseFile } from 'src/app/helpers/others';
import { map, tap } from 'rxjs/operators';
import { createGraph } from 'src/app/riesgos/riesgos.workflowcontrol';
import { environment } from 'src/environments/environment';



@Component({
    selector: 'ukis-helper-buttons',
    templateUrl: './helper-buttons.component.html',
    styleUrls: ['./helper-buttons.component.scss']
})
export class HelperButtonsComponent implements OnInit {

    isRiesgos2: boolean;
    showResetModal = false;
    showRestoreModal = false;
    showStoreModal = false;
    nameControl: FormControl;
    dropFieldText$: BehaviorSubject<string>;
    stateToBeRestored$: BehaviorSubject<RiesgosScenarioState>;
    private currentState: RiesgosScenarioState;

    constructor(
        private store: Store<State>
    ) {
        this.nameControl = new FormControl('Save state', [Validators.required, noSpecialChars]);
        this.isRiesgos2 = environment.isRiesgos2;
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
        this.store.dispatch(new RestaringScenario({scenario: currentScenario}));
        this.showResetModal = false;
    }

    restoreState(): void {
        const stateToRestore: RiesgosScenarioState = this.stateToBeRestored$.value;
        // @TODO: instead of just a ProductsProvided action,
        // create a new action that validates that all data is still there on the remote servers.
        this.store.dispatch(new ProductsProvided({
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
                    graph: createGraph(state.processStates)
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


function noSpecialChars(control: FormControl): { [key: string]: boolean } {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
       return { invalidName: true };
    }
}
