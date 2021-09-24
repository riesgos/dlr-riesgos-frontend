import { HttpClient } from '@angular/common/http';
import { WizardableProcess, WizardProperties } from '../../../components/config_wizard/wizardable_processes';
import { VectorLayerProduct } from '../../riesgos.datatypes.mappable';
import { ProcessStateUnavailable, WpsProcess, Product } from '../../riesgos.datatypes';
import { WpsData } from '@dlr-eoc/utils-ogc';
import { Feature } from '@turf/helpers';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Observable } from 'rxjs';
import { eqShakemapRef } from './shakyground';


export const ConvexHullInput: VectorLayerProduct & WpsData = {
    uid: 'ConvexHullInput',
    description: {
        id: 'data',
        format: 'application/vnd.geo+json',
        name: 'data',
        type: 'complex',
        icon: 'dot-circle',
        reference: false,
        vectorLayerAttributes: {
          style: (f: Feature, r: number, selected: boolean) => {
            return new Style({
              stroke: new Stroke({
                color: '#666666',
                width: 1,
              }),
            });
          }
        }
    },
    value: [{
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [
                -68.90625,
                -17.644022027872712
              ],
              [
                -75.9375,
                -23.88583769986199
              ],
              [
                -63.6328125,
                -22.593726063929296
              ],
              [
                -76.2890625,
                -30.751277776257812
              ],
              [
                -68.5546875,
                -30.751277776257812
              ]
            ]
          }
        }
      ]
    }]
};

export const ConvexHullOutput: VectorLayerProduct & WpsData = {
    uid: 'ConvexHullOutput',
    description: {
        id: 'result',
        format: 'application/vnd.geo+json',
        name: 'result',
        type: 'complex',
        icon: 'dot-circle',
        reference: false,
        vectorLayerAttributes: {
          style: (f: Feature, r: number, selected: boolean) => {
            return new Style({
              stroke: new Stroke({
                color: '#666666',
                width: 1,
              }),
            });
          }
        }
    },
    value: null
};


export class MySimpleService extends WpsProcess implements WizardableProcess {
    wizardProperties: WizardProperties = {
        providerName: 'MyCompany',
        providerUrl: 'my.url.org',
        shape: 'dot-circle',
    };

    constructor(http: HttpClient) {
        super(
            'org.n52.wps.server.algorithm.JTSConvexHullAlgorithm',
            'MyConvexHullSerivce',
            ['ConvexHullInput'],
            ['ConvexHullOutput'],
            'org.n52.wps.server.algorithm.JTSConvexHullAlgorithm',
            'Simple Echo Process',
            'http://riesgos.dlr.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
    }

    // execute(
    //     inputProducts: Product[],
    //     outputProducts?: Product[],
    //     doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

    //     const newInputs = inputProducts.map(p => {
    //         if (p.uid === ConvexHullInput.uid) {
    //             return {
    //                 ... p,
    //                 value: p.value[0].features[0].geometry
    //             };
    //         } else {
    //             return p;
    //         }
    //     });

    //     return super.execute(newInputs, outputProducts, doWhileExecuting);
    // }
}
