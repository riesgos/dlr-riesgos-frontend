import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { ProcessStateAvailable, WpsProcess } from 'src/app/wps/wps.datatypes';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';


export const physicalImpact: VectorLayerData = {
    uid: 'pia_physicalImpact',
    description: {
        id: 'physicalImpact',
        format: 'application/vnd.geo+json',
        name: 'Physical Impact',
        type: 'complex',
        vectorLayerAttributes: {}
    },
    value: null
};


export const PhysicalImpactAssessment: WizardableProcess & WpsProcess = {
    id: 'org.n52.dlr.riesgos.algorithm.PhysicalImpactAssessment',
    name: 'Pysical Impact',
    description: '',
    url: 'http://riesgos.dlr.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    requiredProducts: ['ShakygroundProcess_shakeMapFile_shakemap'],
    providedProducts: ['pia_physicalImpact'],
    state: new ProcessStateAvailable(),
    wizardProperties: {
        providerName: 'German Aerospace Center (DLR)',
        providerUrl: 'https://www.dlr.de',
        shape: 'dot-circle'
    }
};
