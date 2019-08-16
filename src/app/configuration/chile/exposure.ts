import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';



export const exposure: WpsData & WmsLayerData = {
    description: {
        id: 'exposure',
        name: 'exposure',
        type: 'complex',
        reference: false,
        format: 'application/WMS',
    },
    value: null
};



export const ExposureModel: WizardableProcess & WpsProcess = {
    id: 'exposure-model',
    url: '',
    wpsVersion: '1.0.0',
    name: 'EQ Exposure Model',
    description: '',
    requiredProducts: [],
    providedProduct: 'exposure',
    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },
    state: new ProcessStateUnavailable()
};
