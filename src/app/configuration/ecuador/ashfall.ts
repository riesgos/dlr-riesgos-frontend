import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { vei } from './lahar';
import { WpsData } from '@ukis/services-wps/src/public-api';
import { HttpClient } from '@angular/common/http';


export const ashfall: Product & WpsData = {
    uid: 'ashfall',
    description: {
        id: 'ashfall',
        reference: false,
        type: 'complex'
    },
    value: null
};


export class AshfallService extends WpsProcess implements WizardableProcess {

    wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'ashfall-service',
            'Ashfall Service',
            [vei.uid],
            [ashfall.uid],
            'ashfall-service-id',
            '',
            'http://riesgos.dlr.de/wps/WebProcessingService?',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
        );
        this.wizardProperties = {
            providerName: 'Instituto Geofísico EPN',
            providerUrl: 'https://www.igepn.edu.ec',
            shape: 'volcanoe'
        };
    }
}
