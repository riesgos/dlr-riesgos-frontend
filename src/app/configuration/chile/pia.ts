import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { ProcessStateAvailable, WpsProcess } from 'src/app/wps/wps.datatypes';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { shakemapXmlRefOutput } from './shakyground';
import { HttpClient } from '@angular/common/http';


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


export class PhysicalImpactAssessment extends WpsProcess implements WizardableProcess {

    readonly wizardProperties = {
        providerName: 'German Aerospace Center (DLR)',
        providerUrl: 'https://www.dlr.de',
        shape: 'dot-circle' as 'dot-circle'
    };

    constructor(http: HttpClient) {
        super(
            'PIA',
            'Physical Impact',
            [shakemapXmlRefOutput.uid],
            [physicalImpact.uid],
            'org.n52.dlr.riesgos.algorithm.PhysicalImpactAssessment',
            '',
            'http://riesgos.dlr.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateAvailable()
        );
    }
};
