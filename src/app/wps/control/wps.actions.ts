import { Action } from '@ngrx/store';
import { Product } from './product';
import { ProcessState } from './processState';
import { WpsProcess } from './wpsProcess';


export enum EWpsActionTypes {
    productsProvided = "[Wps] Products Provided", 
    processStarted = "[Wps] Process Started", 
    processStateChanged = "[Wps] Process State Changed"
}


export class ProductsProvided implements Action {
    type: string = EWpsActionTypes.productsProvided;
    constructor (public payload: {products: Product[]}) {}
}


export class ProcessStarted implements Action {
    type: string = EWpsActionTypes.processStarted;
    constructor (public payload: {process: WpsProcess}) {}
}


export class ProcessStatesChanged implements Action {
    type: string = EWpsActionTypes.processStateChanged;
    constructor (public payload: {processStates: ProcessState[]}) {}
}


export type WpsActions = ProductsProvided | ProcessStarted | ProcessStatesChanged;