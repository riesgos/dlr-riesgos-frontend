import { Action } from '@ngrx/store';
import { Product, ImmutableProcess, ProcessId } from './wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public-api';
import { Scenario } from './wps.state';
import { Graph } from 'graphlib';


export enum EWpsActionTypes {
    scenarioChosen = '[Wps] Scenario chosen',
    productsProvided = '[Wps] Products provided',
    clickRunProduct = '[Wps] Click on \'run process\' button',
    restartingFromProcess = '[Wps] Restarting from process',
    restartingScenario = '[Wps] Restarting scenario',
    wpsDataUpdate = '[Wps] Data update',
}

export class ScenarioChosen implements Action {
    type: string = EWpsActionTypes.scenarioChosen;
    constructor(public payload: {scenario: Scenario}) {}
}


export class ProductsProvided implements Action {
    type: string = EWpsActionTypes.productsProvided;
    constructor(public payload: {products: Product[]}) {}
}


export class ClickRunProcess implements Action {
    type: string = EWpsActionTypes.clickRunProduct;
    constructor(public payload: {productsProvided: Product[], process: ImmutableProcess}) {}
}



export class RestartingFromProcess implements Action {
    type: string = EWpsActionTypes.restartingFromProcess;
    constructor(public payload: {process: ImmutableProcess}) {}
}

export class RestaringScenario implements Action {
    type: string = EWpsActionTypes.restartingScenario;
    constructor(public payload: {scenario: Scenario}) {}
}


export class WpsDataUpdate implements Action {
    type: string = EWpsActionTypes.wpsDataUpdate;
    constructor(public payload: {processes: ImmutableProcess[], products: Product[], graph: Graph}) {}
}




export type WpsActions = ProductsProvided | ClickRunProcess | RestartingFromProcess | ScenarioChosen | WpsDataUpdate;