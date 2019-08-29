import { WpsProcess, ProcessStateUnavailable, Product } from '../../wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import {  WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { selectedEq } from './eqselection';


export const shakemapWmsOutput: WpsData & WmsLayerData = {
    uid: 'ShakygroundProcess_shakeMapFile_wms',
    description: {
        id: 'shakeMapFile',
        name: 'shakemap',
        type: 'complex',
        reference: false,
        format: 'application/WMS',
        styles: ['shakemap-pga', 'another style']
    },
    value: null
};

export const shakemapOutput: WpsData & Product = {
    uid: 'ShakygroundProcess_shakeMapFile_shakemap',
    description: {
        id: 'shakeMapFile',
        type: 'complex',
        reference: true,
        format: 'text/xml',
    },
    value: null
};


export const Shakyground: WizardableProcess & WpsProcess = {
    state: new ProcessStateUnavailable(),
    id: 'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    name: 'Groundmotion Simulation',
    description: 'Simulates the ground motion caused by a given eathquake',
    requiredProducts: [selectedEq].map(p => p.uid),
    providedProducts: [shakemapWmsOutput, shakemapOutput].map(p => p.uid),
    wpsVersion: '1.0.0',
    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },
};
