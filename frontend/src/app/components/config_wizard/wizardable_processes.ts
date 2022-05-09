import { Process } from 'src/app/riesgos/riesgos.datatypes';



export type shape = 'dot-circle' | 'earthquake' | 'avalanche' | 'tsunami' | 'volcanoe'
| 'critical_infrastructure' | 'vulnerability' | 'exposure' | 'bolt' | 'flame' | 'bullseye' | 'target' | 'router' | 'building';

export interface WizardProperties {
    shape: shape;
    providerName: string;
    providerUrl: string;
    wikiLink?: string;
    dataSources?: {label: string, href?: string}[];
}


export interface WizardableProcess extends Process {
    readonly wizardProperties: WizardProperties;
}


export const isWizardableProcess = (process: Process): process is WizardableProcess => {
    return process['wizardProperties'] !== undefined && process['wizardProperties']['shape'] !== undefined;
}