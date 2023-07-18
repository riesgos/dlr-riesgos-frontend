import { Type } from "@angular/core"
import { RiesgosScenarioControlState } from "src/app/state/state"


export interface Info {
    component: Type<any>,
    args: {[key: string]: any}
}

export interface Legend {
    component: Type<any>,
    args: {[key: string]: any}
}

export interface StepState extends RiesgosScenarioControlState {
    info?: Info,
    legend?: Legend,
    error?: string
}

export interface WizardState {
    stepData: StepState[]
}