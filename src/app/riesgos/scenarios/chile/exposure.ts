import { WpsProcess, ProcessStateUnavailable, Product } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData } from '@dlr-eoc/utils-ogc';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol';
import { HttpClient } from '@angular/common/http';
import { BarData, createBigBarchart } from 'src/app/helpers/d3charts';
import { weightedDamage, greenRedRange } from 'src/app/helpers/colorhelpers';
import { Cache } from '@dlr-eoc/utils-ogc';
import { StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { Observable } from 'rxjs';
import Geometry from 'ol/geom/Geometry';


export const modelChoice: WpsData & StringSelectUconfProduct = {
  uid: 'eq_exposure_model_choice',
  description: {
      wizardProperties: {
          fieldtype: 'stringselect',
          name: 'model',
          description: 'exposure model',
          signpost: 'Please note that the model GFZ 2020 may not yet be fully integrated.'
      },
      id: 'model',
      reference: false,
      title: 'model',
      type: 'literal',
      options: ['ValpCVTSaraDownscaled', 'ValpCVTBayesian'],
      defaultValue: 'ValpCVTSaraDownscaled',
  },
  value: 'ValpCVTSaraDownscaled'
};

export const initialExposure: VectorLayerProduct & WpsData & Product = {
  uid: 'initial_Exposure',
  description: {
    id: 'selectedRowsGeoJson',
    title: '',
    type: 'complex',
    reference: false,
    icon: 'building',
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
      }
    }
  },
  value: null
};


export class ExposureModel extends WpsProcess implements WizardableProcess {

  public wizardProperties: WizardProperties;

  constructor(httpClient: HttpClient, cache: Cache) {
    super(
      'Exposure',
      'EQ Exposure Model',
      [modelChoice.uid],
      [initialExposure.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      '',
      'http://rz-vm140.gfz-potsdam.de:8080/wps/WebProcessingService',
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
