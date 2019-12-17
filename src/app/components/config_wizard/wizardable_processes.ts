import { Process, WpsProcess, ProcessState } from 'src/app/wps/wps.datatypes';
import { WpsVerion } from '@ukis/services-ogc';
import { HttpClient } from '@angular/common/http';


export type shape = 'dot-circle' | 'earthquake' | 'avalance' | 'tsunami' | 'volcanoe'
| 'critical_infrastructure' | 'vulnerability' | 'exposure' | 'bolt' | 'flame' | 'bullseye' | 'target' | 'router' | 'building';

export interface WizardProperties {
    shape: shape;
    providerName: string;
    providerUrl: string;
}


export interface WizardableProcess extends Process {
    readonly wizardProperties: WizardProperties;
}


export const isWizardableProcess = (process: Process): process is WizardableProcess => {
    return process['wizardProperties'] !== undefined && process['wizardProperties']['shape'] !== undefined;
}