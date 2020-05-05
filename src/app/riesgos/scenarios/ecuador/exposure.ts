import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, Product, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData, Cache } from '@dlr-eoc/services-ogc';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { createBigBarchart, Bardata, createBarchart } from 'src/app/helpers/d3charts';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { weightedDamage, greenRedRange } from 'src/app/helpers/colorhelpers';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';


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


export const initialExposureAshfallRef: WpsData & Product = {
  uid: 'initial_Exposure_Ref',
  description: {
    id: 'selectedRowsGeoJson',
    type: 'complex',
    reference: true,
    format: 'application/json'
  },
  value: null
};

export const initialExposureAshfall: VectorLayerProduct & WpsData & Product = {
  uid: 'initial_Exposure',
  description: {
    id: 'selectedRowsGeoJson',
    type: 'complex',
    reference: false,
    icon: 'building',
    format: 'application/json',
    name: 'Exposure Ashfall',
    vectorLayerAttributes: {
      style: (feature: olFeature, resolution: number) => {
        const props = feature.getProperties();

        const expo = props.expo;
        const counts = {
            'D0': 0,
            'D1': 0,
            'D2': 0,
            'D3': 0
        };
        let total = 0;
        for (let i = 0; i < expo.Damage.length; i++) {
            const damageClass = expo.Damage[i];
            const nrBuildings = expo.Buildings[i];
            counts[damageClass] += nrBuildings;
            total += nrBuildings;
        }

        const dr = weightedDamage(Object.values(counts));

        let r: number;
        let g: number;
        let b: number;
        if (total === 0) {
            r = b = g = 0;
        } else {
            [r, g, b] = greenRedRange(0, 1, dr);
        }

        return new olStyle({
          fill: new olFill({
            color: [r, g, b, 0.5],

          }),
          stroke: new olStroke({
            color: [r, g, b, 1],
            witdh: 2
          })
        });
      },
      text: (props: object) => {

        const taxonomies = props['expo']['Taxonomy'];
        const buildings = props['expo']['Buildings'];
        const keys = Object.keys(taxonomies);
        const barchartData: Bardata[] = [];
        for (const key of keys) {
          barchartData.push({
            label: taxonomies[key],
            value: buildings[key]
          });
        }

        const anchor = document.createElement('div');
        const anchorUpdated = createBarchart(anchor, barchartData, 300, 200, 'taxonomy', 'buildings');
        return `<h4>Exposition </h4>${anchor.innerHTML}`;
      }
    }
  },
  value: null
};


export const initialExposureLahar = {
  ... initialExposureAshfall,
  uid: 'initial_Exposure_Lahar',
  description: {
    ... initialExposureAshfall.description,
    name: 'Exposure Lahar'
  }
};

export const initialExposureLaharRef = {
  ... initialExposureAshfallRef,
  uid: 'inital_exposure_lahar_ref'
};


export class AshfallExposureModel extends WpsProcess implements WizardableProcess {

  wizardProperties: WizardProperties;

  constructor(http: HttpClient, cache: Cache) {
    super(
      'AshfallExposure',
      'Ashfall exposure model',
      [lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, schemaEcuador, assettypeEcuador].map(p => p.uid),
      [initialExposureAshfall.uid, initialExposureAshfallRef.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      '',
      'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
      '1.0.0',
      http,
      new ProcessStateUnavailable(),
      cache
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
  }

}


export class LaharExposureModel  extends WpsProcess implements WizardableProcess {

  wizardProperties: WizardProperties;

  constructor(http: HttpClient, cache: Cache) {
    super(
      'LaharExposure',
      'Lahar exposure model',
      [lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, schemaEcuador, assettypeEcuador].map(p => p.uid),
      [initialExposureLahar.uid, initialExposureLaharRef.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      '',
      'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
      '1.0.0',
      http,
      new ProcessStateUnavailable(),
      cache
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
          value: 'Mavrouli_et_al_2014',
        };
      } else {
        return i;
      }
    });
    return super.execute(newInputs, outputs, doWhile);
  }

}

