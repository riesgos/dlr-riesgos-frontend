import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData } from '@ukis/services-ogc';
import { HttpClient } from '@angular/common/http';
import { schemaPeru } from './exposure';



export const assetcategoryPeru: Product & WpsData = {
    uid: 'assetcategoryPeru',
    description: {
        id: 'assetcategory',
        defaultValue: 'buildings',
        reference: false,
        type: 'literal'
    },
    value: 'buildings'
};

export const losscategoryPeru: Product & WpsData = {
    uid: 'losscategoryPeru',
    description: {
        id: 'losscategory',
        defaultValue: 'structural',
        reference: false,
        type: 'literal'
    },
    value: 'structural'
};

export const taxonomiesPeru: Product & WpsData = {
    uid: 'taxonomiesPeru',
    description: {
        id: 'taxonomies',
        reference: false,
        type: 'literal',
        defaultValue: 'none'
    },
    value: 'none'
};


export const fragilityRefPeru: WpsData & Product = {
    uid: 'ModelpropProcess_FragilityPeru',
    description: {
      id: 'selectedRows',
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
            [schemaPeru, assetcategoryPeru, losscategoryPeru, taxonomiesPeru].map(p => p.uid),
            [fragilityRefPeru.uid],
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
