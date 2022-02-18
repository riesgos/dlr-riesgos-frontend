import { createSelector } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { RiesgosState, RiesgosScenarioState } from './riesgos.state';
import { Product, ProcessId, ImmutableProcess } from './riesgos.datatypes';
import { isVectorLayerProduct, isBboxLayerProduct, isWmsProduct, isMultiVectorLayerProduct } from './riesgos.datatypes.mappable';


const getRiesgosState = (state: State) => {
    return state.riesgosState;
};

const getScenarioState = (riesgosState: RiesgosState, scenario: string): RiesgosScenarioState | undefined => {
    const scenarioData = riesgosState.scenarioData[scenario];
    return scenarioData;
};

const getCurrentScenarioState = (riesgosState: RiesgosState): RiesgosScenarioState => {
    const currentScenario = riesgosState.currentScenario;
    return getScenarioState(riesgosState, currentScenario);
};

export const getScenarioMetadata = createSelector(
    getRiesgosState,
    (s: RiesgosState) => s.metaData
);

export const getScenarioRiesgosState = createSelector(
    getRiesgosState,
    (s: RiesgosState, args: {scenario: string}) => getScenarioState(s, args.scenario)
);

export const getCurrentScenarioRiesgosState = createSelector(
    getRiesgosState,
    (s: RiesgosState) => getCurrentScenarioState(s)
);


export const getProcessStates = createSelector(
    getRiesgosState,
    (s: RiesgosState) => getCurrentScenarioState(s).processStates
);


export const getScenario = createSelector(
    getRiesgosState,
    (s: RiesgosState) => s.currentScenario
);


export const getProducts = createSelector(
    getRiesgosState,
    (s: RiesgosState) => getCurrentScenarioState(s).productValues
);

export const getProduct = createSelector(
    getRiesgosState,
    (s: RiesgosState, args: {productId: string}) => {
        const products = getCurrentScenarioState(s).productValues;
        return products.find(p => p.uid === args.productId);
    }
);


export const getGraph = createSelector(
    getRiesgosState,
    (s: RiesgosState) => getCurrentScenarioState(s).graph
);


export const getInputsForProcess = createSelector(
    getRiesgosState,
    (s: RiesgosState, args: {processId: string}) => {
        const process = getProcessById(args.processId, getCurrentScenarioState(s).processStates);
        return filterInputsForProcess(process, getCurrentScenarioState(s).productValues);
    }
);


export const getMapableProducts = createSelector(
    getRiesgosState,
    (s: RiesgosState) => {
        return getCurrentScenarioState(s).productValues
            .filter(prod => prod.value != null)
            .filter(prod => isVectorLayerProduct(prod) || isBboxLayerProduct(prod)
                            || isWmsProduct(prod) || isMultiVectorLayerProduct(prod));
    }
);






export const getProcessById = (id: ProcessId, processes: ImmutableProcess[]): ImmutableProcess => {
    const process = processes.find(p => p.uid === id);
    if (process === undefined) {
        throw new Error(`Could not find process ${id}`);
    }
    return process;
};

export const getProductById = (id: string, products: Product[]): Product => {
    const product = products.find(p => p.uid === id);
    if (product === undefined) {
        throw new Error(`Could not find product ${id}`);
    }
    return product;
};


export const filterInputsForProcess = (process: ImmutableProcess, products: Product[]): Product[] => {
    const filteredProducts = process.requiredProducts.map(pid => getProductById(pid, products));
    return filteredProducts;
};
