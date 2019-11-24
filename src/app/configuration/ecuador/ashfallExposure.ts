import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, Product, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { WpsData } from '@ukis/services-wps/src/public-api';
import { initialExposure, initialExposureRef } from '../chile/exposure';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';



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
    defaultValue: 'Torres_Corredor_et_al_2017',
    reference: false,
    type: 'literal'
  },
  value: 'Mavrouli_et_al_2014', // <- weil als erstes lahar damage. 'Torres_Corredor_et_al_2017' <- wenn als erstes ashfall damage.
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


// export class LaharExposureModel extends WpsProcess implements WizardableProcess {

//   wizardProperties: WizardProperties;

//   constructor(http: HttpClient) {
//     super(
//       'LaharExposure',
//       'Lahar exposure model',
//       [lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, schemaEcuador, assettypeEcuador].map(p => p.uid),
//       [initialExposure.uid, initialExposureRef.uid],
//       'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
//       '',
//       'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
//       '1.0.0',
//       http,
//       new ProcessStateUnavailable()
//     );
//     this.wizardProperties = {
//         shape: 'building',
//         providerName: 'Helmholtz Centre Potsdam',
//         providerUrl: 'https://www.gfz-potsdam.de/en/'
//     };
//   }

//   execute(inputs: Product[], outputs: Product[], doWhile): Observable<Product[]> {
//     const newInputs = inputs.map(i => {
//       if (i.uid === schemaEcuador.uid) {
//         return {
//           ... i,
//           value: 'Mavrouli_et_al_2014', // <- weil als erstes lahar damage. 'Torres_Corredor_et_al_2017' 
//         };
//       }
//     });
//     return super.execute(newInputs, outputs, doWhile);
//   }

// }


export class AshfallExposureModel extends WpsProcess implements WizardableProcess {

  wizardProperties: WizardProperties;

  constructor(http: HttpClient) {
    super(
      'AshfallExposure',
      'Ashfall exposure model',
      [lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, schemaEcuador, assettypeEcuador].map(p => p.uid),
      [initialExposure.uid], // [initialExposure.uid, initialExposureRef.uid],
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

  execute(inputs: Product[], outputs: Product[], doWhile): Observable<Product[]> {
    const newInputs = inputs.map(i => {
      if (i.uid === schemaEcuador.uid) {
        return {
          ... i,
          value: 'Torres_Corredor_et_al_2017',
        };
      } else {
        return i;
      }
    });
    return super.execute(newInputs, outputs, doWhile);
    const newOutputs = outputs.map(prd => {
      if (prd.uid === initialExposure.uid) {
        return {
          ...prd,
          value: [{
            "type": "FeatureCollection",
            "features": [{
                  "type": "Feature",
                  "properties": {
                    expo: {
                      Damage: ['D0', 'D1', 'D2', 'D3', 'D4'],
                      Buildings: [10, 20, 30, 40, 50]
                    }
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [ [
                        [ -78.27918243408203, -0.63075942052164 ],
                        [ -78.27875328063965, -0.58886259879264 ],
                        [ -78.35471343994141, -0.5634523633128 ],
                        [ -78.27918243408203, -0.63075942052164 ] ] ]
                  }
              }]
          }]
        };
      } else {
        return prd;
      }
    });
    return of(newOutputs);
  }

}

