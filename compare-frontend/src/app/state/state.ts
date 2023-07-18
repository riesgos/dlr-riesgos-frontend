import { API_Datum, API_DatumReference, API_ScenarioInfo, API_ScenarioState, API_Step } from "../services/backend.service";
import { RuleSetName } from "./rules";



export type ScenarioName = 'Chile' | 'Peru' | 'PeruShort' | 'Ecuador';
export type ScenarioNameOrNone = 'none' | ScenarioName;
export function scenarioNameIsNotNone(name: ScenarioNameOrNone): name is ScenarioName {
    return name !== 'none';
}

export type PartitionName = 'left' | 'right' | 'top' | 'bottom' | 'middle';

export type StepStateTypes = 'unavailable' | 'available' | 'running' | 'completed' | 'error';

export interface Layer {
    layerCompositeId: string,
    visible: boolean,
    opacity: number,
    type: 'raster' | 'vector',
    data: API_Datum | API_DatumReference
}

export interface RiesgosScenarioMapState {
    zoom: number,
    center: number[],
    clickLocation: number[] | undefined,
    layers: Layer[]
}

export interface ParameterConfiguration {
    id: string,
    label: string,
    options: {[key: string]: any},
    selected: string | undefined,
    default?: string
}

export interface RiesgosScenarioControlState {
    stepId: string,
    title: string,
    hasFocus: boolean,
    isAutoPiloted: boolean,
    state: StepStateTypes,
    configs: ParameterConfiguration[],
    layers: Layer[],
    errorMessage?: string
}

export interface RiesgosScenarioPopupState {
    componentType: string,
    data: {[key: string]: any}
}

export interface AutoPilotState {
    queue: string[];
};

export interface ModalState {
    args?: { title: string, subtitle: string, body: string, closable: boolean }
}

export interface RiesgosScenarioState {
    scenario: ScenarioName;
    apiSteps: API_ScenarioInfo,
    apiData: API_ScenarioState,
    autoPilot: AutoPilotState,
    partition: PartitionName,
    active: boolean,
    map: RiesgosScenarioMapState,
    popup: RiesgosScenarioPopupState,
    controls: RiesgosScenarioControlState[],
    modal: ModalState
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

export interface RiesgosState {
    currentScenario: ScenarioNameOrNone;
    scenarioData: {
        [key in ScenarioName]?: {
            [key in PartitionName]?: RiesgosScenarioState
        }
    };
    metaData: RiesgosScenarioMetadata[];
    rules: RuleSetName | undefined;
}


export const initialRiesgosState: RiesgosState = {
    currentScenario: 'none',
    scenarioData: {},
    metaData: [],
    rules: undefined
};

