import { createAction, props } from '@ngrx/store';
import { Product, ImmutableProcess } from './riesgos.datatypes';
import { Scenario, RiesgosScenarioMetadata } from './riesgos.state';
import { Graph } from 'graphlib';




export const metadataProvided = createAction(
    '[Riesgos] Metadata provided',
    props<{
        metadata: RiesgosScenarioMetadata[]
    }>()
);

export const scenarioChosen = createAction(
    '[Riesgos] Scenario chosen',
    props<{scenario: Scenario}>()
);

export const productsProvided = createAction(
    '[Riesgos] Products provided',
    props<{products: Product[]}>()
);

export const clickRunProcess = createAction(
    '[Riesgos] Click on \'run process\' button',
    props<{productsProvided: Product[], process: ImmutableProcess}>()
);

export const restartingFromProcess = createAction(
    '[Riesgos] Restarting from process',
    props<{process: ImmutableProcess}>()
);

export const restartingScenario = createAction(
    '[Riesgos] Restarting scenario',
    props<{scenario: Scenario}>()
);


/**
 * A RiesgosDataUpdate triggers the riesgos-reducer without first passing through effects.
 * This action is intended to be only called from riesgos.effects.ts!
 * Bypassing riesgos-effects will mean that WFC does not get updated.
 * If you want to add new data from a component, use ProductsProvided instead.
 */
export const riesgosDataUpdate = createAction(
    '[Riesgos] Data update',
    props<{processes: ImmutableProcess[], products: Product[], graph: Graph}>()
);


