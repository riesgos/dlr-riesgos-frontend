import { WizardableProcess, WizzardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { HttpClient } from '@angular/common/http';
import { schema } from './exposure';



export const assetcategory: Product & WpsData = {
    uid: 'user_assetcategory',
    description: {
        id: 'assetcategory',
        defaultValue: 'buildings',
        reference: false,
        type: 'literal'
    },
    value: 'buildings'
};

export const losscategory: Product & WpsData = {
    uid: 'user_losscategory',
    description: {
        id: 'losscategory',
        defaultValue: 'structural',
        reference: false,
        type: 'literal'
    },
    value: 'structural'
};

export const taxonomies: Product & WpsData = {
    uid: 'user_taxonomies',
    description: {
        id: 'taxonomies',
        reference: false,
        type: 'literal',
        defaultValue: 'none'
    },
    value: 'none'
};


export const fragilityRef: WpsData & Product = {
    uid: 'ModelpropProcess_Fragility',
    description: {
      id: 'selectedRows',
      type: 'complex',
      reference: true,
      format: 'application/json'
    },
    value: null
  };


export class VulnerabilityModel extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizzardProperties;

    constructor(http: HttpClient) {
        super(
            'Vulnerability',
            'EQ Vulnerability Model',
            [schema, assetcategory, losscategory, taxonomies].map(p => p.uid),
            [fragilityRef.uid],
            'org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess',
            '',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
        );

        this.wizardProperties = {
            shape: 'dot-circle',
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/'
        };
    }
}
