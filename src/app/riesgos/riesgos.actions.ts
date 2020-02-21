import { Action } from '@ngrx/store';
import { Product, ImmutableProcess, ProcessId } from './riesgos.datatypes';
import { ProductId } from '@ukis/services-ogc';
import { Scenario } from './riesgos.state';
import { Graph } from 'graphlib';


export enum ERiesgosActionTypes {
    scenarioChosen = '[Wps] Scenario chosen',
    productsProvided = '[Wps] Products provided',
    clickRunProduct = '[Wps] Click on \'run process\' button',
    restartingFromProcess = '[Wps] Restarting from process',
    restartingScenario = '[Wps] Restarting scenario',
    wpsDataUpdate = '[Wps] Data update',
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

export class RestaringScenario implements Action {
    type: string = ERiesgosActionTypes.restartingScenario;
    constructor(public payload: {scenario: Scenario}) {}
}


export class RiesgosDataUpdate implements Action {
    type: string = ERiesgosActionTypes.wpsDataUpdate;
    constructor(public payload: {processes: ImmutableProcess[], products: Product[], graph: Graph}) {}
}




export type RiesgosActions = ProductsProvided | ClickRunProcess | RestartingFromProcess | ScenarioChosen | RiesgosDataUpdate;
