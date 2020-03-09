import { WpsProcess, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { latmax, initialExposure, lonmin, lonmax, latmin, querymode, schema, assettype } from './exposure';
import { HttpClient } from '@angular/common/http';



export class RaquelsExposureModel extends WpsProcess {

    constructor(httpClient: HttpClient) {
      super(
        'Exposure',
        'EQ Exposure Model',
        [lonmin, lonmax, latmin, latmax, querymode, schema, assettype].map(p => p.uid),
        [initialExposure.uid],
        'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
        '',
        'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
        '1.0.0',
        httpClient,
        new ProcessStateUnavailable(),
      );
    }
  }