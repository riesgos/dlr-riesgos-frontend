import { createAction, props } from '@ngrx/store';
import { RiesgosState } from './riesgos.state';



export const metadataProvided = createAction(
    '[Riesgos] Metadata provided',
    props<{ metadata: any }>()
);

export const scenarioChosen = createAction(
    '[Riesgos] Scenario chosen',
    props<{scenario: string}>()
);

export const executeStart = createAction(
    '[Riesgos] execute start',
    props<{scenario: string, step: string}>()
);

export const executeSuccess = createAction(
    '[Riesgos] execute success',
    props<{newState: RiesgosState}>()
);

export const executeError = createAction(
    '[Riesgos] execute error',
    props<{error: Error}>()
);

export const userdataProvided = createAction(
    '[Riesgos] userdata provided',
    props<{ data: any }>()
);

export const restartingFromProcess = createAction(
    '[Riesgos] Restarting from process',
    props<{scenario: string, step: string}>()
);

export const restartingScenario = createAction(
    '[Riesgos] Restarting scenario',
    props<{scenario: string}>()
);

