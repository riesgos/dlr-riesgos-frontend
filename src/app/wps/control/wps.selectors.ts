import { createSelector } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { WpsState } from './wps.state';
import { ProductId, WpsData } from 'projects/services-wps/src/public_api';
import { Product, Process } from './wps.datatypes';

const getWpsState = (state: State) => {
    return state.wpsState;
}

export const getProcessStates = createSelector(
    getWpsState, 
    (s: WpsState) => s.processStates
);


export const getInputsForProcess = createSelector(
    getWpsState, 
    (s: WpsState, args: {processId: string}) => {
        const process = s.processStates.get(args.processId);
        if(process) return filterInputsForProcess(process, s.productValues);
    }
)


export const filterInputsForProcess = function(process: Process, products: Map<ProductId, Product>): Map<ProductId, Product> {
    let out = new Map<ProductId, Product>();
    const requiredProductsIds = process.requiredProducts.map(p => p.id);
    for(let id of requiredProductsIds) {
        let val = products.get(id);
        if(val) out.set(id, val);
    }
    return out;
}


export const convertProductsToWpsData = function (inpts: Map<ProductId, Product>): WpsData[] {
    let out: WpsData[] = [];
    inpts.forEach((v, k) => out.push(v));
    return out;
}


export const convertWpsDataToProds = function(data: WpsData[]): Map<ProductId, Product> {
    let out = new Map<ProductId, Product>();
    for(let entry of data) {
        out.set(entry.description.id, entry);
    }
    return out;
}