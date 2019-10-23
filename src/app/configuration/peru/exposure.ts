import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData, VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import {
  UserconfigurableProduct, StringUconfProduct,
  StringSelectUconfProduct
} from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { Bardata, createBarchart } from 'src/app/helpers/d3charts';
import { exposureRef } from '../chile/exposure';


export const lonminPeru: Product & WpsData = {
  uid: 'user_lonmin',
  description: {
    id: 'lonmin',
    type: 'literal',
    reference: false,
    defaultValue: '-71.8'
  },
  value: '-71.8'
};


export const lonmaxPeru: Product & WpsData = {
  uid: 'user_lonmax',
  description: {
    id: 'lonmax',
    type: 'literal',
    reference: false,
    defaultValue: '-71.4'
  },
  value: '-71.4'
};


export const latminPeru: Product & WpsData = {
  uid: 'user_latmin',
  description: {
    id: 'latmin',
    type: 'literal',
    reference: false,
    defaultValue: '-33.2'
  },
  value:  '-33.2'
};


export const latmaxPeru: Product & WpsData = {
  uid: 'user_latmax',
  description: {
    id: 'latmax',
    type: 'literal',
    reference: false,
    defaultValue: '-33.0'
  },
  value: '-33.0'
};


export const schemaPeru: Product & WpsData = {
  uid: 'user_schema',
  description: {
    id: 'schema',
    defaultValue: 'SARA_v1.0',
    reference: false,
    type: 'literal'
  },
  value: 'SARA_v1.0'
};



export const assettypePeru: Product & WpsData = {
  uid: 'user_assettype',
  description: {
    id: 'assettype',
    defaultValue: 'res',
    reference: false,
    type: 'literal',
  },
  value: 'res'
};


export const querymodePeru: Product & WpsData = {
  uid: 'user_querymode',
  description: {
    id: 'querymode',
    // options: ['intersects', 'within'],
    defaultValue: 'intersects',
    reference: false,
    type: 'literal'
  },
  value: 'intersects'
};

export class ExposureModelPeru extends WpsProcess implements WizardableProcess {

  readonly wizardProperties = {
    shape: 'dot-circle' as 'dot-circle',
    providerName: 'Helmholtz Centre Potsdam',
    providerUrl: 'https://www.gfz-potsdam.de/en/'
  };

  constructor(httpClient: HttpClient) {
    super(
      'ExposurePeru',
      'EQ Exposure Model',
      [lonminPeru, lonmaxPeru, latminPeru, latmaxPeru, querymodePeru, schemaPeru, assettypePeru].map(p => p.uid),
      [exposureRef.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      '',
      'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
      '1.0.0',
      httpClient,
      new ProcessStateUnavailable(),
    );
  }
}



