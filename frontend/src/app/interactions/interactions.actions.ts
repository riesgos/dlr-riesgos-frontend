import { createAction, props } from '@ngrx/store';
import { InteractionMode } from './interactions.state';
import { RiesgosProduct, ScenarioName } from '../riesgos/riesgos.state';
import { API_Datum } from '../services/backend/backend.service';


export const interactionStarted = createAction(
    '[Interactions] Interaction started',
    props<{mode: InteractionMode, scenario: ScenarioName, product: API_Datum}>()
);


export const interactionCompleted = createAction(
    '[Interactions] Interaction completed',
    props<{scenario: ScenarioName, product: API_Datum}>()
);

