import { createAction, props } from '@ngrx/store';
import { InteractionMode } from './interactions.state';
import { Product } from '../riesgos/riesgos.datatypes';


export const interactionStarted = createAction(
    '[Interactions] Interaction started',
    props<{mode: InteractionMode, product: Product}>()
);


export const interactionCompleted = createAction(
    '[Interactions] Interaction completed',
    props<{product: Product}>()
);

