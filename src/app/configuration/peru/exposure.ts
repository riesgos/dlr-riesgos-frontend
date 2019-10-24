import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/wps/wps.datatypes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { WmsLayerData, VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { Bardata, createBarchart } from 'src/app/helpers/d3charts';


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


export const exposureRefPeru: VectorLayerData & WpsData & Product = {
  uid: 'AssetmasterProcess_Exposure_Peru',
  description: {
    id: 'selectedRowsGeoJson',
    type: 'complex',
    reference: false,
    format: 'application/json',
    name: 'Exposure',
    vectorLayerAttributes: {
      style: (feature: olFeature, resolution: number) => {

        let pop = 10000;
        const props = feature.getProperties();
        if (props.expo && props.expo.Population) {
          const popObj = feature.getProperties().expo.Population;
          pop = Object.values(popObj).reduce((carry: number, current: number) => carry + current, 0) as number;
        }
        const pop0 = 50000;
        const pop1 = 400000;
        const r = 255 * (pop - pop0) / (pop1 - pop0);
        const g = 255 * (1 - (pop - pop0) / (pop1 - pop0));
        const b = 200;

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
        const anchorUpdated = createBarchart(anchor, barchartData, 600, 400, 'taxonomy', 'buildings', 45);
        return `<h4>Exposure ${props['name']}</h4>${anchor.innerHTML}`;
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
      [exposureRefPeru.uid],
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
