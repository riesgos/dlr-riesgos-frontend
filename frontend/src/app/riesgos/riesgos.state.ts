import { API_Step } from "../services/backend/backend.service";



export type ScenarioName = 'none' | 'Chile' | 'Peru' | 'Ecuador';


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
    options?: string[]
};

export interface RiesgosProductRef extends RiesgosProduct {
    reference: string
}

export interface RiesgosProductResolved extends RiesgosProduct {
    reference?: string,
    value: any
}

export function isRiesgosValueProduct(prod: RiesgosProduct): prod is RiesgosProductResolved {
    return 'value' in prod && !('reference' in prod);
}

export function isRiesgosResolvedRefProduct(prod: RiesgosProduct): prod is RiesgosProductResolved {
    return 'value' in prod && 'reference' in prod;
}

export function isRiesgosUnresolvedRefProduct(prod: RiesgosProduct): prod is RiesgosProductRef {
    return ('reference' in prod) && !('value' in prod);
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
    id: string;
    title: string;
    description: string;
    preview: string;
}


export interface RiesgosState {
    currentScenario: undefined | ScenarioName;
    scenarioData: {
        [key: string]: RiesgosScenarioState
    };
    metaData: RiesgosScenarioMetadata[];
}


export const initialRiesgosState: RiesgosState = {
    currentScenario: undefined,
    scenarioData: {
        Chile: {
            scenario: 'Chile',
            products: [],
            steps: []
        },
        Ecuador: {
            scenario: 'Ecuador',
            products: [],
            steps: []
        },
        Peru: {
            scenario: 'Peru',
            products: [],
            steps: []
        }
    },
    metaData: []
};

