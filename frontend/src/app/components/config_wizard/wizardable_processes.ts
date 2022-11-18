import { RiesgosStep } from 'src/app/riesgos/riesgos.state';



export type shape = 'dot-circle' | 'earthquake' | 'avalanche' | 'tsunami' | 'volcanoe'
| 'critical_infrastructure' | 'vulnerability' | 'exposure' | 'bolt' | 'flame' | 'bullseye' | 'target' | 'router' | 'building';

export interface WizardProperties {
    shape: shape;
    providerName: string;
    providerUrl: string;
    wikiLink?: string;
    dataSources?: {label: string, href?: string}[];
}


export interface WizardableStep extends RiesgosStep {
    readonly wizardProperties: WizardProperties;
}


export const loadWizardProps = (step: RiesgosStep): WizardableStep | undefined => {
    const wizardProps = wizardRegistry[step.step.id];
    if (!wizardProps) return undefined;
    return {
        ...step,
        wizardProperties: wizardProps
    };
}


const wizardRegistry: {[id: string]: WizardProperties} = {
    
};