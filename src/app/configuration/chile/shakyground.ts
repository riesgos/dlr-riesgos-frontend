import { WpsProcess, ProcessStateUnavailable, Product } from '../../wps/wps.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { selectedEq } from './eqselection';
import { HttpClient } from '@angular/common/http';


export const shakemapWmsOutput: WpsData & WmsLayerData = {
    uid: 'Shakyground_wms',
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

export const eqShakemapRef: WpsData & Product = {
    uid: 'Shakyground_shakemap',
    description: {
        id: 'shakeMapFile',
        type: 'complex',
        reference: true,
        format: 'text/xml',
    },
    value: null
};


export class Shakyground extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'Shakyground',
            'Groundmotion Simulation',
            [selectedEq].map(p => p.uid),
            [shakemapWmsOutput, eqShakemapRef].map(p => p.uid),
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
