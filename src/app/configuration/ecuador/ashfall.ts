import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { vei } from './lahar';
import { WpsData } from '@ukis/services-wps/src/public-api';


export const ashfall: Product & WpsData = {
    uid: 'ashfall',
    description: {
        id: 'ashfall',
        reference: false,
        type: 'complex'
    },
    value: null
};


export const AshfallService: WizardableProcess & WpsProcess = {
    uid: 'ashfall-service',
    id: 'ashfall-service-id',
    url: 'https://www.igepn.edu.ec',
    wpsVersion: '1.0.0',
    description: '',
    name: 'Ashfall Service',
    requiredProducts: [vei.uid],
    providedProducts: [ashfall.uid],
    state: new ProcessStateUnavailable(),
    wizardProperties: {
        providerName: 'Instituto Geofísico EPN',
        providerUrl: 'https://www.igepn.edu.ec',
        shape: 'volcanoe'
    }
}