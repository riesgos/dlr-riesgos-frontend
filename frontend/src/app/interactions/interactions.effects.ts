import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { InteractionAction, InteractionActionTypes, InteractionCompleted } from './interactions.actions';
import { ProductsProvided } from '../riesgos/riesgos.actions';
import { map } from 'rxjs/operators';



@Injectable()
export class InteractionEffects {

    $interactionCompleted = createEffect(() => {
        return this.actions$.pipe(
            ofType<InteractionAction>(InteractionActionTypes.completed),
            map((action: InteractionCompleted) => {
                return new ProductsProvided({products: [action.payload.product]});
            })
        );
    });

    constructor(private actions$: Actions) {}

}