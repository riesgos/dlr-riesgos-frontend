import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData, Cache } from '@dlr-eoc/utils-ogc';
import { HttpClient } from '@angular/common/http';
import { schema } from './exposure';



export const assetcategory: Product & WpsData = {
    uid: 'assetcategory',
    description: {
        id: 'assetcategory',
        title: '',
        defaultValue: 'buildings',
        reference: false,
        type: 'literal'
    },
    value: 'buildings'
};

export const losscategory: Product & WpsData = {
    uid: 'losscategory',
    description: {
        id: 'losscategory',
        title: '',
        defaultValue: 'structural',
        reference: false,
        type: 'literal'
    },
    value: 'structural'
};

export const taxonomies: Product & WpsData = {
    uid: 'taxonomies',
    description: {
        id: 'taxonomies',
        title: '',
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
      title: '',
      type: 'complex',
      reference: true,
      format: 'application/json'
    },
    value: null
  };


export class VulnerabilityModel extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
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
            cache
        );

        this.wizardProperties = {
            shape: 'dot-circle',
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/'
        };
    }
}
