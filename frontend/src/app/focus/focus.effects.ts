import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as FocusActions from './focus.actions';
import { map, withLatestFrom } from 'rxjs/operators';
import { State } from '../ngrx_register';
import { Store } from '@ngrx/store';
import { ProcessStateTypes } from '../riesgos/riesgos.datatypes';





Injectable();
export class FocusEffects {


    goingToNext$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(FocusActions.goToNextProcess),
            withLatestFrom(this.store$),
            map(([action, state]) => {
                const currentScenario = state.riesgosState.scenario;
                const activeProcess = state.riesgosState[currentScenario].processStates.find((p) => {
                    return p.state.type === ProcessStateTypes.available;
                });
                if (activeProcess) {
                    return FocusActions.newProcessClicked({processId: activeProcess.uid});
                }
            })
        );
    });


    constructor(
        private actions$: Actions,
        private store$: Store<State>
    ) {}

}
