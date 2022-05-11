import { Action } from '@ngrx/store';
import { InteractionMode } from './interactions.state';
import { Product } from '../riesgos/riesgos.datatypes';


export enum InteractionActionTypes {
    started = '[Interactions] Interaction started',
    completed = '[Interactions] Interaction completed'
}


export class InteractionStarted implements Action {
    type: string = InteractionActionTypes.started;
    constructor(public payload: {mode: InteractionMode, product: Product}) {}
}


export class InteractionCompleted implements Action {
    type: string = InteractionActionTypes.completed;
    constructor(public payload: {product: Product}) {}
}


export type InteractionAction = InteractionStarted | InteractionCompleted;
