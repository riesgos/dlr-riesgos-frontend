import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData, VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { UserconfigurableWpsData, StringUconfWpsData,
        StringSelectUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';


export const lonmin: StringUconfWpsData = {
    description: {
        id: 'lonmin',
        type: 'literal',
        wizardProperties: {
            fieldtype: 'string',
            name: 'lonmin'
        },
        reference: false
    },
    value: null
};


export const lonmax: UserconfigurableWpsData = {
  description: {
      id: 'lonmax',
      type: 'literal',
      wizardProperties: {
          fieldtype: 'string',
          name: 'lonmax'
      },
      reference: false
  },
  value: null
};


export const latmin: StringUconfWpsData = {
  description: {
      id: 'latmin',
      type: 'literal',
      wizardProperties: {
          fieldtype: 'string',
          name: 'latmin'
      },
      reference: false
  },
  value: null
};


export const latmax: StringUconfWpsData = {
description: {
    id: 'latmax',
    type: 'literal',
    wizardProperties: {
        fieldtype: 'string',
        name: 'latmax'
    },
    reference: false
},
value: null
};


export const schema: StringSelectUconfWpsData = {
  description: {
    id: 'schema',
    options: ['SARA_v1.0'],
    reference: false,
    type: 'literal',
    wizardProperties: {
      fieldtype: 'stringselect',
      name: 'Schema'
    }
  },
  value: null
};



export const assettype: StringSelectUconfWpsData = {
  description: {
    id: 'assettype',
    options: ['res'],
    reference: false,
    type: 'literal',
    wizardProperties: {
      fieldtype: 'stringselect',
      name: 'Schema'
    }
  },
  value: null
};


export const querymode: StringSelectUconfWpsData = {
  description: {
    id: 'querymode',
    options: ['intersects', 'within'],
    defaultValue: 'intersects',
    reference: false,
    type: 'literal',
    wizardProperties: {
      fieldtype: 'stringselect',
      name: 'Querymode'
    }
  },
  value: null
};


export const selectedRowsXml: VectorLayerData = {
  description: {
    id: 'selectedRowsXml',
    type: 'complex',
    reference: false,
    format: 'application/vnd.geo+json',
    name: 'selectedRowsXml',
    vectorLayerAttributes: {}
  },
  value: null
};


export const ExposureModel: WizardableProcess & WpsProcess = {
    id: 'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    name: 'EQ Exposure Model',
    description: '',
    requiredProducts: ['lonmin', 'lonmax', 'latmin', 'latmax', 'querymode', 'schema', 'assettype'],
    providedProduct: 'selectedRowsXml',
    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },
    state: new ProcessStateUnavailable()
};



