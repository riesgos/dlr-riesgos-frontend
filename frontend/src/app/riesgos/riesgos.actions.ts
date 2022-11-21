import { createAction, props } from '@ngrx/store';
import { API_ScenarioInfo } from '../services/backend/backend.service';
import { RiesgosProduct, ScenarioName } from './riesgos.state';



export const scenariosLoaded = createAction(
    '[Riesgos] Scenarios loaded',
    props<{ scenarios: API_ScenarioInfo[] }>()
);

export const scenarioChosen = createAction(
    '[Riesgos] Scenario chosen',
    props<{scenario: ScenarioName}>()
);

export const executeStart = createAction(
    '[Riesgos] execute start',
    props<{scenario: ScenarioName, step: string}>()
);

export const executeSuccess = createAction(
    '[Riesgos] execute success',
    props<{scenario: ScenarioName, step: string, newData: RiesgosProduct[]}>()
);

export const executeError = createAction(
    '[Riesgos] execute error',
    props<{scenario: ScenarioName, step: string, error: Error}>()
);

export const userDataProvided = createAction(
    '[Riesgos] user-data provided',
    props<{scenario: ScenarioName, products: any}>()
);

export const restartingFromStep = createAction(
    '[Riesgos] Restarting from step',
    props<{step: string}>()
);

export const restartingScenario = createAction(
    '[Riesgos] Restarting scenario',
    props<{scenario: ScenarioName}>()
);

