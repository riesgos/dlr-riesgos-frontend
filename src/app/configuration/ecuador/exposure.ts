import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, Product, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WpsData } from '@ukis/services-wps/src/public-api';
import { exposure } from '../chile/exposure';
import { HttpClient } from '@angular/common/http';



export const lonminEcuador: Product & WpsData = {
  uid: 'lonmin',
  description: {
    id: 'lonmin',
    type: 'literal',
    reference: false,
    defaultValue: '-79'
  },
  value: '-79'
};


export const lonmaxEcuador: Product & WpsData = {
  uid: 'lahar_lonmax',
  description: {
    id: 'lonmax',
    type: 'literal',
    reference: false,
    defaultValue: '-78'
  },
  value: '-78'
};

export const latminEcuador: Product & WpsData = {
  uid: 'lahar_latmin',
  description: {
    id: 'latmin',
    type: 'literal',
    reference: false,
    defaultValue:  '-1'
  },
  value:   '-1'
};

export const latmaxEcuador: Product & WpsData = {
    uid: 'lahar_latmax',
    description: {
        id: 'latmax',
        type: 'literal',
        reference: false,
        defaultValue: '-0.4'
    },
  value: '-0.4'
};

export const schemaEcuador: Product & WpsData = {
  uid: 'ecuador_schema',
  description: {
    id: 'schema',
    defaultValue: 'SARA_v1.0',
    reference: false,
    type: 'literal'
  },
  value: 'SARA_v1.0'
};



export const assettypeEcuador: Product & WpsData = {
  uid: 'ecuador_assettype',
  description: {
    id: 'assettype',
    defaultValue: 'res',
    reference: false,
    type: 'literal',
  },
  value: 'res'
};



export const querymodeEcuador: Product & WpsData = {
  uid: 'ecuador_querymode',
  description: {
    id: 'querymode',
    // options: ['intersects', 'within'],
    defaultValue: 'intersects',
    reference: false,
    type: 'literal'
  },
  value: 'intersects'
};


export class LaharExposureModel extends WpsProcess implements WizardableProcess {

  wizardProperties: WizardProperties;

  constructor(http: HttpClient) {
    super(
      'LaharExposure',
      'Lahar exposure model',
      [lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, schemaEcuador, assettypeEcuador].map(p => p.uid),
      [exposure.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      '',
      'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
      '1.0.0',
      http,
      new ProcessStateUnavailable()
    );
    this.wizardProperties = {
        shape: 'building',
        providerName: 'Helmholtz Centre Potsdam',
        providerUrl: 'https://www.gfz-potsdam.de/en/'
    };
  }

}
