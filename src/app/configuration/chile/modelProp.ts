import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData, VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { StringSelectUconfWpsData, StringUconfWD, StringUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';



export const assetcategory: StringSelectUconfWpsData = {
    description: {
        id: 'assetcategory',
        options: ['buildings'],
        reference: false,
        type: 'literal',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'assetcategory'
        }
    },
    value: null
};

export const losscategory: StringSelectUconfWpsData = {
    description: {
        id: 'losscategory',
        options: ['structural'],
        reference: false,
        type: 'literal',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'losscategory'
        }
    },
    value: null
};

export const taxonomies: StringUconfWpsData = {
    description: {
        id: 'taxonomies',
        reference: false,
        type: 'literal',
        wizardProperties: {
            fieldtype: 'string',
            name: 'taxonomies'
        }
    },
    value: null
};


export const selectedRows: VectorLayerData = {
    description: {
      id: 'selectedRows',
      type: 'complex',
      reference: false,
      format: 'application/vnd.geo+json',
      name: 'selectedRows',
      vectorLayerAttributes: {}
    },
    value: null
  };


export const VulnerabilityModel: WizardableProcess & WpsProcess = {
    id: 'org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    name: 'EQ Vulnerability Model',
    description: '',
    requiredProducts: ['schema', 'assetcategory', 'losscategory', 'taxonomies'],
    providedProduct: 'selectedRows',
    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },
    state: new ProcessStateUnavailable()
};
