import { RiesgosScenarioControlState } from "./state";



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

export function allParasSet(control: RiesgosScenarioControlState): boolean {
    for (const config of control.configs) {
        if (config.selected === undefined) return false;
    }
    return true;
}


