import { WpsDataDescription, WpsVerion } from 'projects/services-wps/src/public_api';
import { UserconfigurableWpsDataDescription } from 'src/app/components/config_wizard/userconfigurable_wpsdata';




export type ProductDescription = WpsDataDescription | UserconfigurableWpsDataDescription;

export interface Product {
    readonly description: ProductDescription, 
    readonly value: any
}


export type ProcessId = string;


export enum ProcessState {
    unavailable = "unavailable",
    available = "available", 
    runing = "running", 
    completed = "completed", 
    error = "error", 
}



export interface Process {
    readonly id: ProcessId, 
    readonly name: string,
    readonly description: string, 
    readonly url: string, 
    readonly requiredProducts: ProductDescription[], 
    readonly providedProduct: ProductDescription,
    readonly state: ProcessState,
    readonly wpsVersion: WpsVerion
}
