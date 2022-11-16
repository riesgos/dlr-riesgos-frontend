import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { InteractionAction, InteractionActionTypes, InteractionCompleted } from './interactions.actions';
import * as RiesgosActions from '../riesgos/riesgos.actions';
import { map } from 'rxjs/operators';



@Injectable()
export class InteractionEffects {

    $interactionCompleted = createEffect(() => {
        return this.actions$.pipe(
            ofType<InteractionAction>(InteractionActionTypes.completed),
            map((action: InteractionCompleted) => {
                return RiesgosActions.productsProvided({products: [action.payload.product]});
            })
        );
    });

    constructor(private actions$: Actions) {}

}