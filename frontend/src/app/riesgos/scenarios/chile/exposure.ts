import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData } from '../../../services/wps/wps.datatypes';
import { VectorLayerProduct } from 'src/app/mappable/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol';
import { HttpClient } from '@angular/common/http';
import { BarData, createBigBarChart } from 'src/app/helpers/d3charts';
import { weightedDamage } from 'src/app/helpers/colorhelpers';
import { StringSelectUserConfigurableProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable } from 'rxjs';
import Geometry from 'ol/geom/Geometry';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';


export const modelChoice: WpsData & StringSelectUserConfigurableProduct = {
  uid: 'eq_exposure_model_choice',
  description: {
      wizardProperties: {
          fieldtype: 'stringselect',
          name: 'model',
          description: 'exposure model',
      },
      id: 'model',
      reference: false,
      title: 'model',
      type: 'literal',
      options: [
        // 'ValpCVTSaraDownscaled',
        'ValpCVTBayesian',
        'ValpCommuna',
        'ValpRegularOriginal',
        'ValpRegularGrid'
      ],
      defaultValue: 'ValpCVTBayesian',
  },
  value: 'ValpCVTBayesian'
};

export const initialExposure: VectorLayerProduct & WpsData & Product = {
  uid: 'initial_Exposure',
  description: {
    id: 'selectedRowsGeoJson',
    title: '',
    icon: 'building',
    type: 'complex',
    reference: false,
    format: 'application/json',
    name: 'Exposure',
    vectorLayerAttributes: {
      featureStyle: (feature: olFeature<Geometry>, resolution: number) => {
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
        // v-- note that the exposure dataset for chile returns a dict, while the one in peru returns an array.
        for (let i in expo.Damage) {  
            const damageClass = expo.Damage[i];
            const nrBuildings = expo.Buildings[i];
            counts[damageClass] += nrBuildings;
            total += nrBuildings;
        }

        const dr = weightedDamage(Object.values(counts)) / 4;

        let r: number;
        let g: number;
        let b: number;
        let a: number;
        if (total === 0) {
          r = b = g = 160;
          a = 0.9;
      } else {
          // [r, g, b] = greenRedRange(0, 1, dr);
          [r, g, b] = [160, 160, 160];
          a = 0.05;
      }

        return new olStyle({
          fill: new olFill({
            color: [r, g, b, a],

          }),
          stroke: new olStroke({
            color: [r, g, b, 1],
            width: 2
          })
        });
      },
      detailPopupHtml: (props: object) => {

        const expo = props['expo'];

        const data: BarData[] = [];
        for (let i = 0; i < Object.values(expo.Taxonomy).length; i++) {
            const tax = expo['Taxonomy'][i]; // .match(/^[a-zA-Z]*/)[0];
            const bld = expo['Buildings'][i];
            if (!data.map(dp => dp.label).includes(tax)) {
                data.push({
                  label: tax,
                  value: bld
                });
            } else {
              data.find(dp => dp.label === tax).value += bld;
            }
        }

        const anchor = document.createElement('div');
        const anchorUpdated = createBigBarChart(anchor, data, 350, 300, '{{ Taxonomy }}', '{{ Buildings }}');
        return `<h4>{{ Exposure }}</h4>${anchor.innerHTML}`;
      },
      legendEntries: [{
        feature: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ [ [ 5.627918243408203, 50.963075942052164 ], [ 5.627875328063965, 50.958886259879264 ], [ 5.635471343994141, 50.95634523633128 ], [ 5.627918243408203, 50.963075942052164 ] ] ]
        },
          properties: {
            expo: {
              Damage: [],
              Buildings: []
            }
          }
        },
        text: `exposureLegend`
      }],
      globalSummary: (value) => {
        return {
          component: TranslatableStringComponent,
          inputs: {
            text: 'BuildingTypesSaraExtensive'
          }
        };
      }
    }
  },
  value: null
};

export const initialExposureRef: WpsData & Product = {
  uid: 'initial_Exposure_Ref',
  description: {
    id: 'selectedRowsGeoJson',
    reference: true,
    title: '',
    type: 'complex',
  },
  value: null
};


export class ExposureModel extends WpsProcess implements WizardableProcess {

  public wizardProperties: WizardProperties;

  constructor(httpClient: HttpClient, middleWareUrl: string) {
    super(
      'Exposure',
      'EQ Exposure Model',
      [modelChoice.uid],
      [initialExposure.uid, initialExposureRef.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      'exposure_process_description',
      `https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService`,
      '1.0.0',
      httpClient,
      new ProcessStateUnavailable(),
      middleWareUrl
    );

    this.wizardProperties = {
      shape: 'building',
      providerName: 'GFZ',
      providerUrl: 'https://www.gfz-potsdam.de/en/',
      wikiLink: 'ExposureAndVulnerability'
    };
  }

  execute(inputs: Product[], outputs: Product[], doWhileExecuting): Observable<Product[]> {

    const lonmin: Product = {
      uid: 'lonmin',
      description: {
        id: 'lonmin',
        title: 'lonmin',
        type: 'literal',
        reference: false,
        defaultValue: '-71.8'
      },
      value: '-71.8'
    };

    const lonmax: Product & WpsData = {
      uid: 'lonmax',
      description: {
        id: 'lonmax',
        title: 'lonmax',
        type: 'literal',
        reference: false,
        defaultValue: '-71.4'
      },
      value: '-71.4'
    };

    const latmin: Product & WpsData = {
      uid: 'latmin',
      description: {
        id: 'latmin',
        title: 'latmin',
        type: 'literal',
        reference: false,
        defaultValue: '-33.2'
      },
      value:  '-33.2'
    };

    const latmax: Product & WpsData = {
      uid: 'latmax',
      description: {
        id: 'latmax',
        title: 'latmax',
        type: 'literal',
        reference: false,
        defaultValue: '-33.0'
      },
      value: '-33.0'
    };

    const schema: Product & WpsData = {
      uid: 'schema',
      description: {
        id: 'schema',
        title: 'schema',
        reference: false,
        type: 'literal',
      },
      value: 'SARA_v1.0'
    };

    const assettype: Product & WpsData = {
      uid: 'assettype',
      description: {
        id: 'assettype',
        title: '',
        defaultValue: 'res',
        reference: false,
        type: 'literal',
      },
      value: 'res'
    };

    const querymode: Product & WpsData = {
      uid: 'querymode',
      description: {
        id: 'querymode',
        title: '',
        // options: ['intersects', 'within'],
        defaultValue: 'intersects',
        reference: false,
        type: 'literal'
      },
      value: 'intersects'
    };


    const allInputs = [
      ... inputs,
      lonmin, lonmax, latmin, latmax, schema, assettype, querymode
    ];

    return super.execute(allInputs, outputs, doWhileExecuting);
  }
}
