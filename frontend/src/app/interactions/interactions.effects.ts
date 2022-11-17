import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as InteractionActions from './interactions.actions';
import * as RiesgosActions from '../riesgos/riesgos.actions';
import { map } from 'rxjs/operators';



@Injectable()
export class InteractionEffects {

    $interactionCompleted = createEffect(() => {
        return this.actions$.pipe(
            ofType(InteractionActions.interactionCompleted),
            map(action => {
                return RiesgosActions.userdataProvided({ data: action.product });
            })
        );
    });

    constructor(private actions$: Actions) {}

}