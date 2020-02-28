import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getCurrentScenarioRiesgosState } from 'src/app/riesgos/riesgos.selectors';
import { RiesgosScenarioState } from 'src/app/riesgos/riesgos.state';
import { RiesgosDataUpdate, RestaringScenario } from 'src/app/riesgos/riesgos.actions';
import { BehaviorSubject } from 'rxjs';



@Component({
    selector: 'ukis-save-buttons',
    templateUrl: './save-button.component.html',
    styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent implements OnInit {

    showResetModal = false;
    showRestoreModal = false;
    showStoreModal = false;
    nameControl: FormControl;
    dropFieldText$: BehaviorSubject<string>;
    private currentState: RiesgosScenarioState;

    constructor(
        private store: Store<State>
    ) {
        this.nameControl = new FormControl('Save state', [Validators.required]);
    }

    ngOnInit() {
        this.store.pipe(select(getCurrentScenarioRiesgosState)).subscribe((state: RiesgosScenarioState) => {
            this.currentState = state;
        });
        this.dropFieldText$ = new BehaviorSubject<string>('Drop your file here!');
    }

    saveState(): void {
        const name = this.nameControl.value;
        const data = this.currentState;
        // @TODO
        this.showStoreModal = false;
    }

    restoreState(): void {
        // @TODO
        this.showRestoreModal = false;
    }

    onResetClicked(): void {
        const currentScenario = this.currentState.scenario;
        this.store.dispatch(new RestaringScenario({scenario: currentScenario}));
        this.showResetModal = false;
    }

    fileDropped(files: FileList) {
        const file = files[0];
        this.dropFieldText$.next(file.name);
    }

}
