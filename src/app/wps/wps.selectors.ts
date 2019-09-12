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

const getCurrentScenarioState = (wpsState: WpsState) => {
    const currentScenario = wpsState.currentScenario;
    const scenarioData = wpsState.scenarioData[currentScenario];
    return scenarioData;
};

export const getFullWpsState = createSelector(
    getWpsState,
    (s: WpsState) => getCurrentScenarioState(s)
);


export const getProcessStates = createSelector(
    getWpsState,
    (s: WpsState) => getCurrentScenarioState(s).processStates
);


export const getScenario = createSelector(
    getWpsState,
    (s: WpsState) => s.currentScenario
);


export const getProducts = createSelector(
    getWpsState,
    (s: WpsState) => getCurrentScenarioState(s).productValues
);


export const getGraph = createSelector(
    getWpsState,
    (s: WpsState) => getCurrentScenarioState(s).graph
);


export const getInputsForProcess = createSelector(
    getWpsState,
    (s: WpsState, args: {processId: string}) => {
        const process = getProcessById(args.processId, getCurrentScenarioState(s).processStates);
        return filterInputsForProcess(process, getCurrentScenarioState(s).productValues);
    }
);


export const getMapableProducts = createSelector(
    getWpsState,
    (s: WpsState) => {
        return getCurrentScenarioState(s).productValues
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
