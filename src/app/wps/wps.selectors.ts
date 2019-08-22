import { createSelector } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { WpsState } from './wps.state';
import { ProductId, WpsData } from 'projects/services-wps/src/public-api';
import { Product, Process, ProcessId } from './wps.datatypes';
import { ProductsProvided } from './wps.actions';
import { isVectorLayerData, isBboxLayerData, isWmsData } from '../components/map/mappable_wpsdata';


const getWpsState = (state: State) => {
    return state.wpsState;
};


export const getFullWpsState = createSelector(
    getWpsState,
    (s: WpsState) => s
);


export const getProcessStates = createSelector(
    getWpsState,
    (s: WpsState) => s.processStates
);


export const getScenario = createSelector(
    getWpsState,
    (s: WpsState) => s.scenario
);


export const getProducts = createSelector(
    getWpsState,
    (s: WpsState) => s.productValues
);


export const getGraph = createSelector(
    getWpsState,
    (s: WpsState) => s.graph
);


export const getInputsForProcess = createSelector(
    getWpsState,
    (s: WpsState, args: {processId: string}) => {
        const process = getProcessById(args.processId, s.processStates);
        return filterInputsForProcess(process, s.productValues);
    }
);


export const getMapableProducts = createSelector(
    getWpsState,
    (s: WpsState) => {
        return s.productValues
            .filter(prod => prod.value != null)
            .filter(prod => isVectorLayerData(prod) || isBboxLayerData(prod) || isWmsData(prod));
    }
);






export const getProcessById = (id: ProcessId, processes: Process[]): Process => {
    const process = processes.find(p => p.id === id);
    if (process === undefined) {
        throw new Error(`Could not find process ${id}`);
    }
    return process;
};

export const getProductById = (id: ProductId, products: Product[]): Product => {
    const product = products.find(p => p.uid === id);
    if (product === undefined) {
        throw new Error(`Could not find product ${id}`);
    }
    return product;
};


export const filterInputsForProcess = (process: Process, products: Product[]): Product[] => {
    const filteredProducts = process.requiredProducts.map(pid => getProductById(pid, products));
    return filteredProducts;
};


export const convertProductsToWpsData = (inpts: Product[]): WpsData[] => {
    const out: WpsData[] = inpts;
    return out;
};


export const convertWpsDataToProd = (data: WpsData): Product => {
    const uid = `${data.description.sourceProcessId}_${data.description.id}`;
    return {
        ...data,
        uid
    };
};

export const convertWpsDataToProds = (data: WpsData[]): Product[] => {
    const out: Product[] = data.map(d => convertWpsDataToProd(d));
    return out;
};
