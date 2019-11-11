import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData, VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { Bardata, createBarchart, createBigBarchart } from 'src/app/helpers/d3charts';
import { damageRage, redGreenRange } from 'src/app/helpers/colorhelpers';


export const lonminPeru: Product & WpsData = {
  uid: 'lonmin',
  description: {
    id: 'lonmin',
    type: 'literal',
    reference: false,
    defaultValue: '-88'
  },
  value: '-88'
};


export const lonmaxPeru: Product & WpsData = {
  uid: 'lonmax',
  description: {
    id: 'lonmax',
    type: 'literal',
    reference: false,
    defaultValue: '-66'
  },
  value: '-66'
};


export const latminPeru: Product & WpsData = {
  uid: 'latmin',
  description: {
    id: 'latmin',
    type: 'literal',
    reference: false,
    defaultValue: '-21'
  },
  value:  '-21'
};


export const latmaxPeru: Product & WpsData = {
  uid: 'latmax',
  description: {
    id: 'latmax',
    type: 'literal',
    reference: false,
    defaultValue: '-0'
  },
  value: '-0'
};


export const schemaPeru: Product & WpsData = {
  uid: 'schema',
  description: {
    id: 'schema',
    defaultValue: 'SARA_v1.0',
    reference: false,
    type: 'literal'
  },
  value: 'SARA_v1.0'
};



export const assettypePeru: Product & WpsData = {
  uid: 'assettype',
  description: {
    id: 'assettype',
    defaultValue: 'res',
    reference: false,
    type: 'literal',
  },
  value: 'res'
};


export const querymodePeru: Product & WpsData = {
  uid: 'querymode',
  description: {
    id: 'querymode',
    // options: ['intersects', 'within'],
    defaultValue: 'intersects',
    reference: false,
    type: 'literal'
  },
  value: 'intersects'
};


export const initialExposurePeru: VectorLayerData & WpsData & Product = {
  uid: 'AssetmasterProcess_Exposure_Peru',
  description: {
    id: 'selectedRowsGeoJson',
    icon: 'building',
    type: 'complex',
    reference: false,
    format: 'application/json',
    name: 'Exposure',
    vectorLayerAttributes: {
      style: (feature: olFeature, resolution: number) => {
        const props = feature.getProperties();

        const expo = props.expo;
        const counts = {
            'D0': 0,
            'D1': 0,
            'D2': 0,
            'D3': 0,
            'D4': 0
        };
        let total = 0;
        for (let i = 0; i < expo.Damage.length; i++) {
            const damageClass = expo.Damage[i];
            const nrBuildings = expo.Buildings[i];
            counts[damageClass] += nrBuildings;
            total += nrBuildings;
        }

        const dr = damageRage(Object.values(counts));

        let r: number;
        let g: number;
        let b: number;
        if (total === 0) {
            r = b = g = 0;
        } else {
            [r, g, b] = redGreenRange(0, 1, dr);
        }

        return new olStyle({
          fill: new olFill({
            color: [r, g, b, 0.3],

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
        const anchorUpdated = createBigBarchart(anchor, barchartData, 400, 300, 'taxonomia', 'edificios');
        return `<h4>Exposición ${props['name']}</h4>${anchor.innerHTML}`;
      }
    }
  },
  value: null
};


export class ExposureModelPeru extends WpsProcess implements WizardableProcess {

  readonly wizardProperties: WizardProperties;

  constructor(httpClient: HttpClient) {
    super(
      'ExposurePeru',
      'EQ Exposure Model',
      [lonminPeru, lonmaxPeru, latminPeru, latmaxPeru, querymodePeru, schemaPeru, assettypePeru].map(p => p.uid),
      [initialExposurePeru.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      '',
      'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
      '1.0.0',
      httpClient,
      new ProcessStateUnavailable(),
    );
    this.wizardProperties =  {
      shape: 'building',
      providerName: 'Helmholtz Centre Potsdam',
      providerUrl: 'https://www.gfz-potsdam.de/en/'
    };
  }
}
