import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData, Cache } from 'src/app/services/wps';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import olFeature from 'ol/Feature';
import { HttpClient } from '@angular/common/http';
import { BarData, createBigBarchart } from 'src/app/helpers/d3charts';
import { weightedDamage, greenRedRange } from 'src/app/helpers/colorhelpers';
import { Observable } from 'rxjs';
import { StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import Geometry from 'ol/geom/Geometry';



export const modelChoicePeru: WpsData & StringSelectUconfProduct = {
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
        'LimaCVT1_PD30_TI70_5000',
        'LimaCVT2_PD30_TI70_10000',
        'LimaCVT3_PD30_TI70_50000',
        'LimaCVT4_PD40_TI60_5000',
        'LimaCVT5_PD40_TI60_10000',
        'LimaCVT6_PD40_TI60_50000',
        'LimaBlocks',
      ],
      defaultValue: 'LimaCVT1_PD30_TI70_5000',
  },
  value: 'LimaCVT1_PD30_TI70_5000'
};

export const initialExposurePeru: VectorLayerProduct & WpsData & Product = {
  uid: 'AssetmasterProcess_Exposure_Peru',
  description: {
    id: 'selectedRowsGeoJson',
    title: '',
    icon: 'building',
    type: 'complex',
    reference: false,
    format: 'application/json',
    name: 'Exposure',
    vectorLayerAttributes: {
      style: (feature: olFeature<Geometry>, resolution: number) => {
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

        const dr = weightedDamage(Object.values(counts)) / 4;

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
            width: 2
          })
        });
      },
      text: (props: object) => {

        const expo = props['expo'];

        const data: BarData[] = [];
        for (let i = 0; i < Object.values(expo.Taxonomy).length; i++) {
            const tax = expo['Taxonomy'][i].match(/^[a-zA-Z]*/)[0];
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
        const anchorUpdated = createBigBarchart(anchor, data, 400, 300, '{{ Taxonomy }}', '{{ Buildings }}');
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
    }
  },
  value: null
};


export class ExposureModelPeru extends WpsProcess implements WizardableProcess {

  public wizardProperties: WizardProperties;

  constructor(httpClient: HttpClient, cache: Cache) {
    super(
      'ExposurePeru',
      'EQ Exposure Model',
      [modelChoicePeru].map(p => p.uid),
      [initialExposurePeru.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      'exposure_process_description',
      'https://rz-vm140.gfz-potsdam.de:8443/wps/WebProcessingService',
      '1.0.0',
      httpClient,
      new ProcessStateUnavailable(),
      cache
    );
    this.wizardProperties = {
      shape: 'building',
      providerName: 'GFZ',
      providerUrl: 'https://www.gfz-potsdam.de/en/',
      wikiLink: 'ExposureAndVulnerability'
    };
  }

  execute(inputs: Product[], outputs: Product[], doWhileExecuting): Observable<Product[]> {
    
    const lonminPeru: Product & WpsData = {
      uid: 'lonmin',
      description: {
        id: 'lonmin',
        title: 'lonmin',
        type: 'literal',
        reference: false,
        defaultValue: '-88'
      },
      value: '-88'
    };
    
    const lonmaxPeru: Product & WpsData = {
      uid: 'lonmax',
      description: {
        id: 'lonmax',
        title: 'lonmax',
        type: 'literal',
        reference: false,
        defaultValue: '-66'
      },
      value: '-66'
    };
    
    const latminPeru: Product & WpsData = {
      uid: 'latmin',
      description: {
        id: 'latmin',
        title: 'latmin',
        type: 'literal',
        reference: false,
        defaultValue: '-21'
      },
      value:  '-21'
    };
    
    const latmaxPeru: Product & WpsData = {
      uid: 'latmax',
      description: {
        id: 'latmax',
        title: 'latmax',
        type: 'literal',
        reference: false,
        defaultValue: '-0'
      },
      value: '-0'
    };
    
    const schemaPeru: Product & WpsData = {
      uid: 'schema',
      description: {
        id: 'schema',
        title: 'schema',
        defaultValue: 'SARA_v1.0',
        reference: false,
        type: 'literal',
      },
      value: 'SARA_v1.0'
    };
    
    const assettypePeru: Product & WpsData = {
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
    
    const querymodePeru: Product & WpsData = {
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
      lonminPeru, lonmaxPeru, latminPeru, latmaxPeru, schemaPeru, assettypePeru, querymodePeru
    ];

    return super.execute(allInputs, outputs, doWhileExecuting);
  }
}
