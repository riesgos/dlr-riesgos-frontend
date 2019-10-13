import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { StringSelectUconfProduct, StringUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { schema } from './assetmaster';



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
    uid: 'org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess_selectedRows',
    description: {
      id: 'selectedRows',
      type: 'complex',
      reference: true,
      format: 'application/json'
    },
    value: null
  };


export const VulnerabilityModel: WizardableProcess & WpsProcess = {
    id: 'org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    name: 'EQ Vulnerability Model',
    description: '',
    requiredProducts: [schema, assetcategory, losscategory, taxonomies].map(p => p.uid),
    providedProducts: [fragilityRef.uid],
    wizardProperties: {
        shape: 'dot-circle',
        providerName: 'Helmholtz Centre Potsdam',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },
    state: new ProcessStateUnavailable()
};
