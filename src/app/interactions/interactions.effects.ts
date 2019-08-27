import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { InteractionAction, InteractionActionTypes, InteractionCompleted } from './interactions.actions';
import { ProductsProvided } from '../wps/wps.actions';
import { map, withLatestFrom } from 'rxjs/operators';
import { State } from '../ngrx_register';
import { Store } from '@ngrx/store';
import { Product } from '../wps/wps.datatypes';



@Injectable()
export class InteractionEffects {

    @Effect()
    $interactionCompleted = this.actions$.pipe(
        ofType<InteractionAction>(InteractionActionTypes.completed),
        map((action: InteractionCompleted) => {
            return new ProductsProvided({products: [action.payload.product]});
        })
    );


    constructor(private actions$: Actions) {}

}