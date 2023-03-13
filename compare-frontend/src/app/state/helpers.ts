import { API_ScenarioState, API_Datum, API_DatumReference, isApiDatum } from "../services/backend.service";
import { isRiesgosResolvedRefProduct, isRiesgosUnresolvedRefProduct, RiesgosProduct, RiesgosStep } from "./state";


export function allParasSet(step: RiesgosStep, products: RiesgosProduct[]): boolean {
    let allSet = true;
    for (const input of step.step.inputs) {
        if (input.options) {
            const id = input.id;
            const existingValue = products.find(p => p.id === id)?.value;
            const existingDefault = input.default;
            if (!existingValue && !existingDefault) {
                allSet = true;
            }
        }
    }
    return allSet;
}

export function fillWithDefaults(step: RiesgosStep, products: RiesgosProduct[]) {
    const configuration: any = {};
    for (const input of step.step.inputs) {
        configuration[step.step.id] = undefined;

        const product = products.find(p => p.id === input.id);
        const productValue = product?.value;
        const defaultValue = input.default;

        if (productValue) configuration[step.step.id] = productValue;
        if (defaultValue) configuration[step.step.id] = defaultValue;
    }
    return configuration;
}




export function convertFrontendDataToApiState(products: RiesgosProduct[]): API_ScenarioState {
    const data: (API_Datum | API_DatumReference)[] = [];
    for (const product of products) {

        const datum: any = {
            id: product.id
        };

        if (product.options) {
            datum.options = product.options;
        }

        if (isRiesgosUnresolvedRefProduct(product) || isRiesgosResolvedRefProduct(product)) {
            datum.reference = product.reference;
        } 
        
        else if (product.value) {
            datum.value = product.value;
        }

        data.push(datum);
    }
    const apiState: API_ScenarioState = {
        data
    };
    return apiState;
}

export function convertApiDataToRiesgosData(apiData: (API_Datum | API_DatumReference)[]): RiesgosProduct[] {
    
    const riesgosData: RiesgosProduct[] = [];

    for (const apiProduct of apiData) {
        
        const prod: RiesgosProduct = {
            id: apiProduct.id
        };

        if ((apiProduct as any).options) {
            prod.options = (apiProduct as any).options;
        }

        if (isApiDatum(apiProduct)) {
            prod.value = apiProduct.value;
        } 
        
        else {
            prod.reference = apiProduct.reference;
        }

        riesgosData.push(prod);
    }
    return riesgosData;
}
