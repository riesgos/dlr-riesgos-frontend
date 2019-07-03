import { WpsDataDescription, WpsVerion, ProductId } from 'projects/services-wps/src/public_api';
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
    running = "running", 
    completed = "completed", 
    error = "error", 
}



export interface Process {
    readonly id: ProcessId, 
    readonly name: string,
    readonly requiredProducts: ProductId[], 
    readonly providedProduct: ProductId,
    readonly state: ProcessState,
}


export const isProcess = (o: any): o is Process => {
    return o.hasOwnProperty("id") &&  o.hasOwnProperty("requiredProducts") &&  o.hasOwnProperty("providedProduct");
}


export interface WpsProcess extends Process {
    readonly description: string, 
    readonly url: string, 
    readonly wpsVersion: WpsVerion
}


export const isWpsProcess = (p: Process): p is WpsProcess => {
    return p.hasOwnProperty("url") && p.hasOwnProperty("state") && p.hasOwnProperty("wpsVersion");
}


export interface WatchingProcess extends Process {
    onProductAdded(newProduct: Product, allProducts: Product[]): Product[];
}


export const isWatchingProcess = (process: Process): process is WatchingProcess => {
    return process.hasOwnProperty("onProductAdded");
}