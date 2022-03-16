import { Action } from '@ngrx/store';
import { Product, ImmutableProcess, ProcessId } from './riesgos.datatypes';
import { ProductId } from 'src/app/services/wps';
import { Scenario, RiesgosScenarioMetadata } from './riesgos.state';
import { Graph } from 'graphlib';


export enum ERiesgosActionTypes {
    metadataProvided = '[Riesgos] Metadata provided',
    scenarioChosen = '[Riesgos] Scenario chosen',
    productsProvided = '[Riesgos] Products provided',
    clickRunProduct = '[Riesgos] Click on \'run process\' button',
    restartingFromProcess = '[Riesgos] Restarting from process',
    restartingScenario = '[Riesgos] Restarting scenario',
    wpsDataUpdate = '[Riesgos] Data update',
}


export class MetadataProvided implements Action {
    type: string = ERiesgosActionTypes.metadataProvided;
    constructor(public payload: {metadata: RiesgosScenarioMetadata[]}) {}
}


export class ScenarioChosen implements Action {
    type: string = ERiesgosActionTypes.scenarioChosen;
    constructor(public payload: {scenario: Scenario}) {}
}


export class ProductsProvided implements Action {
    type: string = ERiesgosActionTypes.productsProvided;
    constructor(public payload: {products: Product[]}) {}
}


export class ClickRunProcess implements Action {
    type: string = ERiesgosActionTypes.clickRunProduct;
    constructor(public payload: {productsProvided: Product[], process: ImmutableProcess}) {}
}



export class RestartingFromProcess implements Action {
    type: string = ERiesgosActionTypes.restartingFromProcess;
    constructor(public payload: {process: ImmutableProcess}) {}
}

export class RestartingScenario implements Action {
    type: string = ERiesgosActionTypes.restartingScenario;
    constructor(public payload: {scenario: Scenario}) {}
}


/**
 * A RiesgosDataUpdate triggers the riesgos-reducer without first passing through effects.
 * This action is intended to be only called from riesgos.effects.ts!
 * Bypassing riesgos-effects will mean that WFC does not get updated.
 * If you want to add new data from a component, use ProductsProvided instead.
 */
export class RiesgosDataUpdate implements Action {
    type: string = ERiesgosActionTypes.wpsDataUpdate;
    constructor(public payload: {processes: ImmutableProcess[], products: Product[], graph: Graph}) {}
}




export type RiesgosActions = MetadataProvided | ProductsProvided
            | ClickRunProcess | RestartingFromProcess
            | ScenarioChosen | RiesgosDataUpdate;
