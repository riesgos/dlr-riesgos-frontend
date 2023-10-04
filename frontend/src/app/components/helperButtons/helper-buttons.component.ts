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



@Component({
    selector: 'ukis-helper-buttons',
    templateUrl: './helper-buttons.component.html',
    styleUrls: ['./helper-buttons.component.scss']
})
export class HelperButtonsComponent implements OnInit {

    showResetModal = false;
    showPrintModal = false;
    private currentState: RiesgosScenarioState;

    constructor(
        private store: Store<State>
    ) {
    }

    ngOnInit() {
        this.store.pipe(select(getCurrentScenarioRiesgosState)).subscribe((state: RiesgosScenarioState) => {
            this.currentState = state;
        });
    }


    onResetClicked(): void {
        const currentScenario = this.currentState.scenario;
        this.store.dispatch(RiesgosActions.restartingScenario({scenario: currentScenario}));
        this.showResetModal = false;
    }


}

