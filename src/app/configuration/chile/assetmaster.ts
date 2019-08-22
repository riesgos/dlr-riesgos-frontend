import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData, VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { UserconfigurableWpsData, StringUconfWpsData,
        StringSelectUconfWpsData } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { convertWpsDataToProds, convertWpsDataToProd } from 'src/app/wps/wps.selectors';


export const lonmin: StringUconfWpsData = {
    description: {
        id: 'lonmin',
        sourceProcessId: 'user',
        type: 'literal',
        wizardProperties: {
            fieldtype: 'string',
            name: 'lonmin'
        },
        reference: false,
        defaultValue: -71.8
    },
    value: null
};


export const lonmax: UserconfigurableWpsData = {
  description: {
      id: 'lonmax',
      sourceProcessId: 'user',
      type: 'literal',
      wizardProperties: {
          fieldtype: 'string',
          name: 'lonmax'
      },
      reference: false,
      defaultValue: -71.4
  },
  value: null
};


export const latmin: StringUconfWpsData = {
  description: {
      id: 'latmin',
      sourceProcessId: 'user',
      type: 'literal',
      wizardProperties: {
          fieldtype: 'string',
          name: 'latmin'
      },
      reference: false,
      defaultValue: -33.2
  },
  value: null
};


export const latmax: StringUconfWpsData = {
description: {
    id: 'latmax',
    sourceProcessId: 'user',
    type: 'literal',
    wizardProperties: {
        fieldtype: 'string',
        name: 'latmax'
    },
    reference: false,
    defaultValue: -33.0
},
value: null
};


export const schema: StringSelectUconfWpsData = {
  description: {
    id: 'schema',
    sourceProcessId: 'user',
    options: ['SARA_v1.0'],
    defaultValue: 'SARA_v1.0',
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
    sourceProcessId: 'user',
    options: ['res'],
    defaultValue: 'res',
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
    sourceProcessId: 'user',
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
    sourceProcessId: 'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
    type: 'complex',
    reference: false,
    format: 'application/vnd.geo+json',
    name: 'selectedRowsXml',
    vectorLayerAttributes: {
      style: (feature: olFeature, resolution: number) => {
        return new olStyle({
          image: new olCircle({
            radius: 30,
            fill: new olFill({
              color: 'blue'
            }),
            stroke: new olStroke({
              color: 'white',
              witdh: 1
            })
          })
        });
      },
      text: (feature: olFeature) => {
        return JSON.stringify(feature);
      }
    },
  },
  value: null
};


export const ExposureModel: WizardableProcess & WpsProcess = {
    id: 'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
    url: 'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
    wpsVersion: '1.0.0',
    name: 'EQ Exposure Model',
    description: '',
    requiredProducts: convertWpsDataToProds([lonmin, lonmax, latmin, latmax, querymode, schema, assettype]).map(p => p.uid),
    providedProduct: convertWpsDataToProd(selectedRowsXml).uid,
    wizardProperties: {
        shape: 'earthquake',
        providerName: 'Helmholtz Centre Potsdam German Research Centre for Geosciences',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    },
    state: new ProcessStateUnavailable()
};



