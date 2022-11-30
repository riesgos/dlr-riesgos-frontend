import { createSelector } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { RiesgosState, RiesgosScenarioState, RiesgosStep, RiesgosProduct, ScenarioName } from './riesgos.state';


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

export const getScenarioRiesgosState = (scenario: string) => createSelector(
    getRiesgosState,
    (s: RiesgosState) => getScenarioState(s, scenario)
);

export const getCurrentScenarioRiesgosState = createSelector(
    getRiesgosState,
    (s: RiesgosState) => getCurrentScenarioState(s)
);


export const getSteps = createSelector(
    getRiesgosState,
    (s: RiesgosState) => getCurrentScenarioState(s).steps
);


export const getCurrentScenarioName = createSelector(
    getRiesgosState,
    (s: RiesgosState) => s.currentScenario
);


export const getProducts = createSelector(
    getRiesgosState,
    (s: RiesgosState) => getCurrentScenarioState(s).products
);

export const getProductsWithValOrRef = createSelector(
    getProducts,
    (p: RiesgosProduct[]) => p.filter(p => p.value || p.reference)
);

export const getProduct = (productId: string) => createSelector(
    getRiesgosState,
    (s: RiesgosState) => {
        const products = getCurrentScenarioState(s).products;
        return products.find(p => p.id === productId);
    }
);

export const getProductsForScenario = (scenario: ScenarioName) => createSelector(
    getRiesgosState,
    s => s.scenarioData[scenario].products
);

export const getInputsForStep = (processId: string) => createSelector(
    getRiesgosState,
    (s: RiesgosState) => {
        const step = getStepById(processId, getCurrentScenarioState(s).steps);
        return filterInputsForStep(step, getCurrentScenarioState(s).products);
    }
);

export const getStepById = (id: string, steps: RiesgosStep[]): RiesgosStep => {
    const step = steps.find(p => p.step.id === id);
    if (step === undefined) {
        throw new Error(`Could not find step ${id}`);
    }
    return step;
};

export const getProductById = (id: string, products: RiesgosProduct[]): RiesgosProduct => {
    const product = products.find(p => p.id === id);
    if (product === undefined) {
        throw new Error(`Could not find product ${id}`);
    }
    return product;
};


export const filterInputsForStep = (step: RiesgosStep, products: RiesgosProduct[]): RiesgosProduct[] => {
    const filteredProducts = step.step.inputs.map(input => getProductById(input.id, products));
    return filteredProducts;
};
