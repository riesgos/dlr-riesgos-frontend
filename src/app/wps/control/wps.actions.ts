import { Action } from '@ngrx/store';
import { Product, Process } from './workflowcontrol';


export enum EWpsActionTypes {
    productsProvided = "[Wps] Products Provided", 
    processStarted = "[Wps] Process Started", 
    processStatesChanged = "[Wps] Process States Changed"
}


export class ProductsProvided implements Action {
    type: string = EWpsActionTypes.productsProvided;
    constructor (public payload: {products: Product[]}) {}
}


export class ProcessStarted implements Action {
    type: string = EWpsActionTypes.processStarted;
    constructor (public payload: {process: Process}) {}
}


export class ProcessStatesChanged implements Action {
    type: string = EWpsActionTypes.processStatesChanged;
    constructor (public payload: {processes: Process[]}) {}
}


export type WpsActions = ProductsProvided | ProcessStarted | ProcessStatesChanged;