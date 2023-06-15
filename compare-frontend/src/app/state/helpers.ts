import { API_ScenarioState, API_Datum, API_DatumReference, isApiDatum } from "../services/backend.service";
import { Rules } from "./rules";
import { isRiesgosResolvedRefProduct, isRiesgosUnresolvedRefProduct, Partition, RiesgosProduct, RiesgosStep, ScenarioName } from "./state";


export function calcAutoPilotableSteps(rules: Rules, steps: RiesgosStep[]) {
    let autoPilotableSteps: string[] = [];
    if ("include" in rules.autoPilot) {
      autoPilotableSteps = rules.autoPilot.include;
    } else {
      const excluded = rules.autoPilot.exclude;
      const autoPilotable = steps.map(s => s.step.id).filter(i => !excluded.includes(i));
      autoPilotableSteps = autoPilotable;
    }
    return autoPilotableSteps;
  }

export function maybeArraysEqual(a1: any[] | undefined, a2: any[] | undefined) {
    if (a1 === undefined && a2 === undefined) return true;
    if (a1 === undefined || a2 === undefined) return false;
    return arraysEqual(a1, a2);
}

export function arraysEqual(a1: any[], a2: any[]) {
    if (a1.length !== a2.length) return false;
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

export function allProductsEqual(list1: RiesgosProduct[], list2: RiesgosProduct[]): boolean {
    const refsEqual = arraysEqual(list1.map(p => p.reference), list2.map(p => p.reference));
    if (!refsEqual) return false;

    // only need to check prods that don't have references.
    const prodsWOrefs1 = list1.filter(p => !p.reference);
    const prodsWOrefs2 = list2.filter(p => !p.reference);

    const vals1 = prodsWOrefs1.map(p => JSON.stringify(p.value));
    const vals2 = prodsWOrefs2.map(p => JSON.stringify(p.value));

    const valsEqual = arraysEqual(vals1, vals2);
    if (!valsEqual) return false;

    // @TODO: also check options?

    return true;
}

export function allParasSet(step: RiesgosStep, products: RiesgosProduct[]): boolean {
    for (const input of step.step.inputs) {
        const id = input.id;
        const existingValue = products.find(p => p.id === id)?.value;
        const existingReference = products.find(p => p.id === id)?.reference;
        const existingDefault = input.default;
        if (!existingValue && !existingReference && !existingDefault) {
            return false;
        }
    }
    return true;
}

export function fillWithDefaults(step: RiesgosStep, products: RiesgosProduct[]) {
    const configuration: any = {};
    for (const input of step.step.inputs) {
        configuration[step.step.id] = undefined;

        const product = products.find(p => p.id === input.id);
        const productValue = product?.value;
        const defaultValue = input.default;
        const firstOption = input.options?.length ? input.options[0] : undefined;

        if (productValue) configuration[step.step.id] = productValue;
        else if (defaultValue) configuration[step.step.id] = defaultValue;
        else if (firstOption) configuration[step.step.id] = firstOption;
    }
    console.log(`Setting defaults: ${configuration}`);
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


export function getMapPositionForStep(scenario: ScenarioName, partition: Partition, stepId: string): {center: number[], zoom: number} {
    if (scenario === 'PeruShort') {
        switch (stepId) {
            case 'selectEq':
                return { zoom: 7, center: [-77.6, -12] };
            case 'EqSimulation':
                return { zoom: 7, center: [-77.15, -12] };
            case 'Exposure':
                return { zoom: 10, center: [-77.15, -12] };
            case 'EqDamage':
                return { zoom: 10, center: [-77.15, -12] };
            case 'Tsunami':
                return { zoom: 6, center: [-77.15, -12] };
            case 'TsDamage':
                return { zoom: 10, center: [-77.15, -12] };
            case 'SysRel':
                return { zoom: 9.5, center: [-77.15, -12] };
        }
    }
    return { zoom: 4, center: [-77.15, -12] };
}