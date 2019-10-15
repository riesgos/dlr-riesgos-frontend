import { WpsDataDescription, WpsVerion, ProductId, WpsData } from 'projects/services-wps/src/public-api';
import { UserconfigurableProductDescription } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { Observable } from 'rxjs';


export type ProductDescription = object;

export interface Product {
    readonly uid: string;
    readonly description: ProductDescription;
    readonly value: any;
}


export type ProcessId = string;


export enum ProcessStateTypes {
    unavailable = 'unavailable',
    available = 'available',
    running = 'running',
    completed = 'completed',
    error = 'error',
}

export class ProcessStateUnavailable {
    type: string = ProcessStateTypes.unavailable;
}


export class ProcessStateAvailable {
    type: string = ProcessStateTypes.available;
}


export class ProcessStateRunning {
    type: string = ProcessStateTypes.running;
}


export class ProcessStateCompleted {
    type: string = ProcessStateTypes.completed;
}


export class ProcessStateError {
    type: string = ProcessStateTypes.error;
    constructor(public message: string) {}
}

export type ProcessState = ProcessStateUnavailable | ProcessStateAvailable |
                            ProcessStateRunning | ProcessStateCompleted | ProcessStateError;



export interface Process {
    readonly uid: ProcessId;
    readonly name: string;
    readonly requiredProducts: ProductId[];
    readonly providedProducts: ProductId[];
    readonly state: ProcessState;
}


export const isProcess = (o: any): o is Process => {
    return o.hasOwnProperty('id') &&  o.hasOwnProperty('requiredProducts') &&  o.hasOwnProperty('providedProduct');
};


export interface WpsProcess extends Process {
    readonly id: string;
    readonly description: string;
    readonly url: string;
    readonly wpsVersion: WpsVerion;
}

export const isWpsProcess = (p: Process): p is WpsProcess => {
    return p.hasOwnProperty('url') && p.hasOwnProperty('state') && p.hasOwnProperty('wpsVersion');
};


export interface CustomProcess extends Process {
    execute: (inputs: Product[]) => Observable<Product[]>;
}

export const isCustomProcess = (p: Process): p is CustomProcess => {
    return p.hasOwnProperty('execute');
};


export interface WatchingProcess extends Process {
    onProductAdded(newProduct: Product, allProducts: Product[]): Product[];
}


export const isWatchingProcess = (process: Process): process is WatchingProcess => {
    return process.hasOwnProperty('onProductAdded');
};
