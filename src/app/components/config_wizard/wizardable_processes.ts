import { Process, WpsProcess, ProcessState } from 'src/app/wps/wps.datatypes';
import { WpsVerion } from '@ukis/services-wps/src/public-api';
import { HttpClient } from '@angular/common/http';


export interface WizzardProperties {
    shape: 'dot-circle' | 'earthquake' | 'avalance' | 'tsunami' | 'volcanoe' | 'critical_infrastructure' | 'vulnerability' | 'exposure';
    providerName: string;
    providerUrl: string;
}


export interface WizardableProcess extends Process {
    readonly wizardProperties: WizzardProperties;
}


export const isWizardableProcess = (process: Process): process is WizardableProcess => {
    return process['wizardProperties'] !== undefined && process['wizardProperties']['shape'] !== undefined;
}