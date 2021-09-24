import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { ProcessStateAvailable, WpsProcess } from 'src/app/riesgos/riesgos.datatypes';
import { VectorLayerProduct, WmsLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { eqShakemapRef } from './shakyground';
import { HttpClient } from '@angular/common/http';
import { WpsData } from '@dlr-eoc/utils-ogc';
import { Style as OlStye, Fill as OlFill } from 'ol/style';


// export const physicalImpact: VectorLayerProduct & WpsData = {
//     uid: 'pia_physicalImpact',
//     description: {
//         id: 'physicalImpact',
//         format: 'application/vnd.geo+json',
//         name: 'Physical Impact',
//         type: 'complex',
//         icon: 'dot-circle',
//         reference: false,
//         vectorLayerAttributes: {
//             style: (f) => {
//                 return new OlStye({
//                     fill: new OlFill({
//                         color: 'rgb(255, 0, 0)'
//                     })
//                 });
//             }
//         }
//     },
//     value: null
// };

export const physicalImpact: WmsLayerProduct & WpsData = {
    uid: 'pia_physicalImpact',
    description: {
        id: 'physicalImpact',
        title: 'physicalImpact',
        name: 'Physical Impact',
        type: 'complex',
        icon: 'dot-circle',
        reference: false,
        format: 'application/WMS',
    },
    value: null
};

export class PhysicalImpactAssessment extends WpsProcess implements WizardableProcess {

    readonly wizardProperties = {
        providerName: 'DLR',
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
}
