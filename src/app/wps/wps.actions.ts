import { Action } from '@ngrx/store';
import { Product, Process, ProcessId } from './wps.datatypes';
import { ProductId } from 'projects/services-wps/src/public_api';


export enum EWpsActionTypes {
    productsProvided = "[Wps] Products Provided", 
    clickRunProduct = "[Wps] Click on 'run process' button",
    processStarted = "[Wps] Process Started",
    scenarioChosen = "[Wps] Scenario chosen",
    initialStateObtained = "[Wps] Initial state obtained"
}


export class ProductsProvided implements Action {
    type: string = EWpsActionTypes.productsProvided;
    constructor (public payload: {products: Product[]}) {}
}


export class ClickRunProcess implements Action {
    type: string = EWpsActionTypes.clickRunProduct;
    constructor (public payload: {productsProvided: Product[], process: Process}) {}
}


export class ProcessStarted implements Action {
    type: string = EWpsActionTypes.processStarted;
    constructor (public payload: {process: Process}) {}
}



export class ScenarioChosen implements Action {
    type: string = EWpsActionTypes.scenarioChosen;
    constructor(public payload: {scenario: string}) {}
}


export class InitialStateObtained implements Action {
    type: string = EWpsActionTypes.initialStateObtained;
    constructor(public payload: {products: Product[], processes: Process[]}) {}
}


export type WpsActions = ProductsProvided | ClickRunProcess | ProcessStarted | ScenarioChosen;