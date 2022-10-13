import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export const fragilityRefPeru: WpsData & Product = {
    uid: 'ModelpropProcess_FragilityPeru',
    description: {
      id: 'selectedRows',
      title: '',
      type: 'complex',
      reference: true,
      format: 'application/json'
    },
    value: null
  };


export class VulnerabilityModelPeru extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'Vulnerability',
            'EQ Vulnerability Model',
            ['schema'],
            [fragilityRefPeru.uid],
            'org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess',
            '',
            `https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService`,
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );

        this.wizardProperties = {
            shape: 'dot-circle',
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/'
        };
    }
    
    execute(inputs, outputs, doWhileExecuting): Observable<Product[]> {


        const assetCategory: Product & WpsData = {
            uid: 'assetcategory',
            description: {
                id: 'assetcategory',
                title: '',
                reference: false,
                type: 'literal'
            },
            value: 'buildings'
        };

        const lossCategory: Product & WpsData = {
            uid: 'losscategory',
            description: {
                id: 'losscategory',
                title: '',
                reference: false,
                type: 'literal'
            },
            value: 'structural'
        };

        const taxonomies: Product & WpsData = {
            uid: 'taxonomies',
            description: {
                id: 'taxonomies',
                title: '',
                reference: false,
                type: 'literal',
            },
            value: 'none'
        };

        const allInputs = [
            ... inputs, assetCategory, lossCategory, taxonomies
        ];
        return super.execute(allInputs, outputs, doWhileExecuting);
    }
}
