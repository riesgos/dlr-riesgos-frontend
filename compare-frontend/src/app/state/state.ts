import { Store } from "@ngrx/store";
import { API_Step } from "../services/backend.service";



export type ScenarioName = 'Chile' | 'Peru' | 'Ecuador';
export type ScenarioNameOrNone = 'none' | ScenarioName;


export enum StepStateTypes {
    unavailable = 'unavailable',
    available = 'available',
    running = 'running',
    completed = 'completed',
    error = 'error',
}
export class StepStateUnavailable {
    type: string = StepStateTypes.unavailable;
}
export class StepStateAvailable {
    type: string = StepStateTypes.available;
}
export class StepStateRunning {
    type: string = StepStateTypes.running;
}
export class StepStateCompleted {
    type: string = StepStateTypes.completed;
}
export class StepStateError {
    type: string = StepStateTypes.error;
    constructor(public message: string) {}
}
export type StepState = StepStateUnavailable | StepStateAvailable |
                        StepStateRunning | StepStateCompleted | StepStateError;


export interface RiesgosStep {
    step: API_Step,
    state: StepState
}

export interface RiesgosProduct {
    id: string,
    options?: string[],
    value?: any,
    reference?: string,
};

export interface RiesgosProductRef extends RiesgosProduct {
    reference: string
}

export interface RiesgosProductResolved extends RiesgosProduct {
    reference: string,
    value: any
}

export function isRiesgosValueOnlyProduct(prod: RiesgosProduct): prod is RiesgosProductResolved {
    return 'value' in prod && !('reference' in prod);
}

export function isRiesgosValueProduct(prod: RiesgosProduct): prod is RiesgosProductResolved {
    return 'value' in prod;
}

export function isRiesgosResolvedRefProduct(prod: RiesgosProduct): prod is RiesgosProductResolved {
    return 'value' in prod && 'reference' in prod && 
        prod.value !== undefined && prod.reference !== undefined;
}

export function isRiesgosUnresolvedRefProduct(prod: RiesgosProduct): prod is RiesgosProductRef {
    return ('reference' in prod) && !('value' in prod) && prod.reference !== undefined;
}

export interface RiesgosScenarioState {
    scenario: ScenarioName;
    steps: RiesgosStep[];
    products: RiesgosProduct[];
}


export function isRiesgosScenarioState(obj: object): obj is RiesgosScenarioState {
    return  obj.hasOwnProperty('scenario') &&
            obj.hasOwnProperty('processStates') &&
            obj.hasOwnProperty('productValues') &&
            obj.hasOwnProperty('graph');
}


export interface RiesgosScenarioMetadata {
    id: ScenarioName;
    title: string;
    description: string;
    preview: string;
}

export interface FocusState {
    focusedStep: string
}


export interface RiesgosState {
    currentScenario: ScenarioNameOrNone;
    scenarioData: {
        [key in ScenarioName]?: RiesgosScenarioState
    };
    metaData: RiesgosScenarioMetadata[];
    focusState: FocusState;
}


export const initialRiesgosState: RiesgosState = {
    currentScenario: 'none',
    scenarioData: {},
    metaData: [],
    focusState: {
        focusedStep: ''
    }
};
