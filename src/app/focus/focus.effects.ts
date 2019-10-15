import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { FocusAction, EFocusActionTypes, GoToNextProcess, NewProcessClicked } from './focus.actions';
import { map, withLatestFrom } from 'rxjs/operators';
import { State } from '../ngrx_register';
import { Store } from '@ngrx/store';
import { ProcessStateTypes } from '../wps/wps.datatypes';





Injectable();
export class FocusEffects {


    @Effect()
    goingToNext$ = this.actions$.pipe(
        ofType<FocusAction>(EFocusActionTypes.goToNextProcess),
        withLatestFrom(this.store$),
        map(([action, state]) => {
            const currentScenario = state.wpsState.currentScenario;
            const activeProcess = state.wpsState.scenarioData[currentScenario].processStates.find((p) => {
                return p.state.type === ProcessStateTypes.available;
            });
            if (activeProcess) {
                return new NewProcessClicked({processId: activeProcess.uid});
            }
        })
    );


    constructor(private actions$: Actions, private store$: Store<State>) {}

}
