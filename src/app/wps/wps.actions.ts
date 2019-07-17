import { Action } from '@ngrx/store';
import { Product, Process, ProcessId } from './wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public_api';
import { Scenario } from './wps.state';


export enum EWpsActionTypes {
    scenarioChosen = "[Wps] Scenario chosen",
    productsProvided = "[Wps] Products Provided", 
    clickRunProduct = "[Wps] Click on 'run process' button",
    restartingFromProcess = "[Wps] Restarting from process", 
    wpsDataUpdate = "[Wps] Data update", 
}

export class ScenarioChosen implements Action {
    type: string = EWpsActionTypes.scenarioChosen;
    constructor(public payload: {scenario: Scenario}) {}
}


export class ProductsProvided implements Action {
    type: string = EWpsActionTypes.productsProvided;
    constructor (public payload: {products: Product[]}) {}
}


export class ClickRunProcess implements Action {
    type: string = EWpsActionTypes.clickRunProduct;
    constructor (public payload: {productsProvided: Product[], process: Process}) {}
}



export class RestartingFromProcess implements Action {
    type: string = EWpsActionTypes.restartingFromProcess;
    constructor(public payload: {process: Process}) {}
}


export class WpsDataUpdate implements Action {
    type: string = EWpsActionTypes.wpsDataUpdate;
    constructor(public payload: {processes: Process[], products: Product[]}) {}
}




export type WpsActions = ProductsProvided | ClickRunProcess | RestartingFromProcess | ScenarioChosen | WpsDataUpdate;