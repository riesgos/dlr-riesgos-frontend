import { Process } from 'src/app/wps/control/wps.datatypes';




export interface WizardableProcess extends Process {
    shape: "dot-circle" | "earthquake" | "avalance" | "tsunami" | "volcanoe"
}


export const isWizardableProcess = (process: Process): process is WizardableProcess => {
    return process["shape"] != undefined;
}