import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsProcess, Product, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { WpsData, Cache } from 'src/app/services/wps';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BarData, createBarChart } from 'src/app/helpers/d3charts';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { weightedDamage, greenRedRange } from 'src/app/helpers/colorhelpers';
import { Style as olStyle, Fill as olFill, Stroke as olStroke } from 'ol/style';
import olFeature from 'ol/Feature';
import { IDynamicComponent } from 'src/app/components/dynamic-component/dynamic-component.component';
import { TranslatableStringComponent } from 'src/app/components/dynamic/translatable-string/translatable-string.component';
import Geometry from 'ol/geom/Geometry';


export const lonminEcuador: Product & WpsData = {
  uid: 'lonmin',
  description: {
    id: 'lonmin',
    title: '',
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
    title: '',
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
    title: '',
    type: 'literal',
    reference: false,
    defaultValue: '-1'
  },
  value: '-1'
};

export const latmaxEcuador: Product & WpsData = {
  uid: 'lahar_latmax',
  description: {
    id: 'latmax',
    title: '',
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
    title: '',
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
    title: '',
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
    title: '',
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
    title: '',
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
    title: '',
    type: 'complex',
    reference: false,
    icon: 'building',
    format: 'application/json',
    name: 'Exposure Ashfall',
    vectorLayerAttributes: {
      style: (feature: olFeature<Geometry>, resolution: number) => {
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

        const dr = weightedDamage(Object.values(counts)) / 3;

        let r: number;
        let g: number;
        let b: number;
        if (total === 0) {
          r = b = g = 160;
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

        const taxonomies = props['expo']['Taxonomy'];
        const buildings = props['expo']['Buildings'];
        const keys = Object.keys(taxonomies);
        const barchartData: BarData[] = [];
        for (const key of keys) {
          barchartData.push({
            label: taxonomies[key],
            value: buildings[key]
          });
        }

        const anchor = document.createElement('div');
        const anchorUpdated = createBarChart(anchor, barchartData, 400, 300, '{{ Taxonomy }}', '{{ Buildings }}');
        return `<h4>{{ Exposure }}</h4>${anchor.innerHTML} {{ BuildingTypesTorres }}`;
      },
      summary: (value: any) => {
        const comp: IDynamicComponent = {
          component: TranslatableStringComponent,
          inputs: {
            text: 'BuildingTypesTorres'
          }
        };
        return comp;
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


export const initialExposureLahar = {
  ...initialExposureAshfall,
  uid: 'initial_Exposure_Lahar',
  description: {
    ...initialExposureAshfall.description,
    vectorLayerAttributes: {
      ... initialExposureAshfall.description.vectorLayerAttributes,
      text: (props: object) => {
        const taxonomies = props['expo']['Taxonomy'];
        const buildings = props['expo']['Buildings'];
        const keys = Object.keys(taxonomies);
        const barchartData: BarData[] = [];
        for (const key of keys) {
          barchartData.push({
            label: taxonomies[key],
            value: buildings[key]
          });
        }

        const anchor = document.createElement('div');
        const anchorUpdated = createBarChart(anchor, barchartData, 400, 300, '{{ Taxonomy }}', '{{ Buildings }}');
        return `<h4>{{ Exposure }}</h4>${anchor.innerHTML} {{ BuildingTypesMavrouli }}`;
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
      summary: (value: any) => {
        return 'BuildingTypesMavrouli';
      }
    },
    name: 'Exposure Lahar'
  }
};

export const initialExposureLaharRef = {
  ...initialExposureAshfallRef,
  uid: 'inital_exposure_lahar_ref'
};

export const modelEcuador: WpsData & Product = {
  uid: 'exposure_model_ecuador',
  description: {
    id: 'model',
    reference: false,
    title: 'model',
    type: 'literal',
  },
  value: 'LatacungaRuralAreas'
};


export class AshfallExposureModel extends WpsProcess implements WizardableProcess {

  wizardProperties: WizardProperties;

  constructor(http: HttpClient, cache: Cache) {
    super(
      'AshfallExposure',
      'Ashfall exposure model',
      [lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador, querymodeEcuador, schemaEcuador, assettypeEcuador, modelEcuador].map(p => p.uid),
      [initialExposureAshfall.uid, initialExposureAshfallRef.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      'exposure_process_description',
      'https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
      '1.0.0',
      http,
      new ProcessStateUnavailable(),
      cache
    );
    this.wizardProperties = {
      shape: 'building',
      providerName: 'GFZ',
      providerUrl: 'https://www.gfz-potsdam.de/en/',
      wikiLink: 'ExposureAndVulnerabilityEcuador',
    };
  }

  execute(inputs: Product[], outputs: Product[], doWhile): Observable<Product[]> {
    const newInputs = inputs.map(i => {
      if (i.uid === schemaEcuador.uid) {
        return {
          ...i,
          value: 'Torres_Corredor_et_al_2017',
        };
      } else {
        return i;
      }
    });
    return super.execute(newInputs, outputs, doWhile);
  }

}


export class LaharExposureModel extends WpsProcess implements WizardableProcess {

  wizardProperties: WizardProperties;

  constructor(http: HttpClient, cache: Cache) {
    super(
      'LaharExposure',
      'Lahar exposure model',
      [lonminEcuador, lonmaxEcuador, latminEcuador, latmaxEcuador,
        querymodeEcuador, schemaEcuador, assettypeEcuador, modelEcuador].map(p => p.uid),
      [initialExposureLahar.uid, initialExposureLaharRef.uid],
      'org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess',
      'exposure_process_description',
      'https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
      '1.0.0',
      http,
      new ProcessStateUnavailable(),
      cache
    );
    this.wizardProperties = {
      shape: 'building',
      providerName: 'GFZ',
      providerUrl: 'https://www.gfz-potsdam.de/en/',
      wikiLink: 'ExposureAndVulnerabilityEcuador'
    };
  }

  execute(inputs: Product[], outputs: Product[], doWhile): Observable<Product[]> {
    const newInputs = inputs.map(i => {
      if (i.uid === schemaEcuador.uid) {
        return {
          ...i,
          value: 'Mavrouli_et_al_2014',
        };
      } else {
        return i;
      }
    });
    return super.execute(newInputs, outputs, doWhile);
  }

}

