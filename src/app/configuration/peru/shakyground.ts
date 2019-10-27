import { WpsProcess, ProcessStateUnavailable, Product } from '../../wps/wps.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { selectedEqPeru } from './eqselection';
import { HttpClient } from '@angular/common/http';


export const shakemapWmsOutputPeru: WpsData & WmsLayerData = {
    uid: 'ShakygroundProcess_shakeMapFile_wmsPeru',
    description: {
        id: 'shakeMapFile',
        icon: 'earthquake',
        name: 'shakemap',
        type: 'complex',
        reference: false,
        format: 'application/WMS',
        styles: ['shakemap-pga', 'another style']
    },
    value: null
};

export const shakemapXmlRefOutputPeru: WpsData & Product = {
    uid: 'ShakygroundProcess_shakeMapFile_shakemapPeru',
    description: {
        id: 'shakeMapFile',
        type: 'complex',
        reference: true,
        format: 'text/xml',
    },
    value: null
};


export class ShakygroundPeru extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'ShakygroundPeru',
            'Groundmotion Simulation',
            [selectedEqPeru].map(p => p.uid),
            [shakemapWmsOutputPeru, shakemapXmlRefOutputPeru].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
            'Simulates the ground motion caused by a given eathquake',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
        this.wizardProperties = {
            shape: 'earthquake',
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/'
        };
    }

}
