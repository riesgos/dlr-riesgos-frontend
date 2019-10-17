import { Process } from 'src/app/wps/wps.datatypes';




export interface WizardableProcess extends Process {
    wizardProperties: {
        shape: 'dot-circle' | 'earthquake' | 'avalance' | 'tsunami' | 'volcanoe' | 'critical_infrastructure' | 'vulnerability' | 'exposure' | 'bolt' | 'flame' | 'bullseye' | 'target' | 'router' | 'building',
        providerName: string,
        providerUrl: string
    }
}


export const isWizardableProcess = (process: Process): process is WizardableProcess => {
    return process['wizardProperties'] !== undefined && process['wizardProperties']['shape'] !== undefined;
}