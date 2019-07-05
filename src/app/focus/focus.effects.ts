import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from '@ngrx/effects';
import { FocusAction, EFocusActionTypes, GoToNextProcess, NewProcessClicked } from './focus.actions';
import { map, withLatestFrom } from 'rxjs/operators';
import { State } from '../ngrx_register';
import { Store } from '@ngrx/store';
import { ProcessStateTypes } from '../wps/wps.datatypes';





Injectable()
export class FocusEffects {


    @Effect()
    goingToNext$ = this.actions$.pipe(
        ofType<FocusAction>(EFocusActionTypes.goToNextProcess), 
        withLatestFrom(this.store$),
        map(([action, state]) => {
            const activeProcess = state.wpsState.processStates.find(p => p.state.type == ProcessStateTypes.available);
            if(activeProcess) {
                return new NewProcessClicked({processId: activeProcess.id})
            }
        })
    );


    constructor(private actions$: Actions, private store$: Store<State>) {}

}