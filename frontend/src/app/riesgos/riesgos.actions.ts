import { createAction, props } from '@ngrx/store';
import { RiesgosScenarioMetadata, RiesgosScenarioState, ScenarioName } from './riesgos.state';



export const scenariosLoaded = createAction(
    '[Riesgos] Scenarios loaded',
    props<{ scenarios: RiesgosScenarioMetadata[] }>()
);

export const scenarioChosen = createAction(
    '[Riesgos] Scenario chosen',
    props<{scenario: ScenarioName}>()
);

export const executeStart = createAction(
    '[Riesgos] execute start',
    props<{scenario: ScenarioName, step: string, state: RiesgosScenarioState}>()
);

export const executeSuccess = createAction(
    '[Riesgos] execute success',
    props<{newState: RiesgosScenarioState}>()
);

export const executeError = createAction(
    '[Riesgos] execute error',
    props<{error: Error}>()
);

export const userdataProvided = createAction(
    '[Riesgos] userdata provided',
    props<{ products: any }>()
);

export const restartingFromStep = createAction(
    '[Riesgos] Restarting from step',
    props<{step: string}>()
);

export const restartingScenario = createAction(
    '[Riesgos] Restarting scenario',
    props<{scenario: ScenarioName}>()
);

