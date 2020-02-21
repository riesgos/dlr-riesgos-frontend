import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { ProcessStateAvailable, WpsProcess } from 'src/app/riesgos/riesgos.datatypes';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { eqShakemapRef } from './shakyground';
import { HttpClient } from '@angular/common/http';


export const physicalImpact: VectorLayerProduct = {
    uid: 'pia_physicalImpact',
    description: {
        id: 'physicalImpact',
        format: 'application/vnd.geo+json',
        name: 'Physical Impact',
        type: 'complex',
        icon: 'dot-circle',
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
            [eqShakemapRef.uid],
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
