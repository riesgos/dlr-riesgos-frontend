import { API_Datum, API_DatumReference, API_ScenarioInfo, API_ScenarioState, API_Step } from "../services/backend/backend.service";



export type ScenarioName = 'none' | 'Chile' | 'Peru' | 'Ecuador';

export type StepState = 'unavailable' | 'ready' | 'running' | 'compete' | 'error';


export interface RiesgosScenarioState {
    scenario: ScenarioName;
    stepStates: {
        step: API_Step,
        state: StepState
    }[];
    productValues: (API_Datum | API_DatumReference)[];
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
    currentScenario: ScenarioName;
    scenarioData: {
        [key: string]: RiesgosScenarioState
    };
    metaData: RiesgosScenarioMetadata[];
}


export const initialRiesgosState: RiesgosState = {
    currentScenario: 'none',
    scenarioData: {
        'none': {
            scenario: 'none',
            stepStates: [],
            productValues: []
        }
    },
    metaData: []
};

