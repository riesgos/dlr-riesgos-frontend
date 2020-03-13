import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData } from '@dlr-eoc/services-ogc';
import { WmsLayerProduct, VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import {
  UserconfigurableProduct, StringUconfProduct,
  StringSelectUconfProduct
} from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { Bardata, createBarchart, createBigBarchart } from 'src/app/helpers/d3charts';
import { weightedDamage, redGreenRange, greenRedRange } from 'src/app/helpers/colorhelpers';


export const lonmin: Product & WpsData = {
  uid: 'lonmin',
  description: {
    id: 'lonmin',
    type: 'literal',
    reference: false,
    defaultValue: '-71.8'
  },
  value: '-71.8'
};


export const lonmax: Product & WpsData = {
  uid: 'lonmax',
  description: {
    id: 'lonmax',
    type: 'literal',
    reference: false,
    defaultValue: '-71.4'
  },
  value: '-71.4'
};


export const latmin: Product & WpsData = {
  uid: 'latmin',
  description: {
    id: 'latmin',
    type: 'literal',
    reference: false,
    defaultValue: '-33.2'
  },
  value:  '-33.2'
};


export const latmax: Product & WpsData = {
  uid: 'latmax',
  description: {
    id: 'latmax',
    type: 'literal',
    reference: false,
    defaultValue: '-33.0'
  },
  value: '-33.0'
};


export const schema: Product & WpsData = {
  uid: 'schema',
  description: {
    id: 'schema',
    defaultValue: 'SARA_v1.0',
    reference: false,
    type: 'literal'
  },
  value: 'SARA_v1.0'
};



export const assettype: Product & WpsData = {
  uid: 'assettype',
  description: {
    id: 'assettype',
    defaultValue: 'res',
    reference: false,
    type: 'literal',
  },
  value: 'res'
};


export const querymode: Product & WpsData = {
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


export const initialExposureRef: WpsData & Product = {
  uid: 'initial_Exposure_Ref',
  description: {
    id: 'selectedRowsGeoJson',
    type: 'complex',
    reference: true,
    format: 'application/json'
  },
  value: null
};

export const initialExposure: VectorLayerProduct & WpsData & Product = {
  uid: 'initial_Exposure',
  description: {
    id: 'selectedRowsGeoJson',
    type: 'complex',
    reference: false,
    icon: 'building',
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
        const anchorUpdated = createBigBarchart(anchor, barchartData, 400, 300, 'taxonomy', 'buildings');
        return `<h4>Exposición </h4>${anchor.innerHTML}`;
      }
    }
  },
  value: null
};


export class ExposureModel extends WpsProcess {

  constructor(httpClient: HttpClient) {
    super(
      'Exposure',
      'EQ Exposure Model',
      [lonmin, lonmax, latmin, latmax, querymode, schema, assettype].map(p => p.uid),
      [initialExposure.uid],
      'org.n52.gfz.riesgos.algorithm.impl.OldAssetmasterProcess',
      '',
      'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
      '1.0.0',
      httpClient,
      new ProcessStateUnavailable(),
    );
  }
}



