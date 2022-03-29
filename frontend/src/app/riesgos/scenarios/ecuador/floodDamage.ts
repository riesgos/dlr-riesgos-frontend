import { WpsProcess, ProcessStateUnavailable, Product, ProductTransformingProcess } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from '../../../../../../proxy/src/wps/public-api';
import { durationTiff, velocityTiff, depthTiff } from './geomerHydrological';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import olFeature from 'ol/Feature';
import { FeatureCollection, MultiPolygon, Polygon } from '@turf/helpers';
import proj4 from 'proj4';  // requires "allowSyntheticDefaultImports": true
import { HttpClient } from '@angular/common/http';
import { greenRedRange } from 'src/app/helpers/colorhelpers';
import { BarData, createBarChart } from 'src/app/helpers/d3charts';
import { Cache } from '../../../../../../proxy/src/wps/public-api';
import Geometry from 'ol/geom/Geometry';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


proj4.defs('EPSG:32717', '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs');
// proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs'); <-- already known


const damageManzanas: WpsData & Product = {
    uid: 'FlooddamageProcess_damageManzanas',
    description: {
        id: 'damage_manzanas',
        title: 'damage_manzanas',
        reference: false,
        type: 'complex',
        format: 'application/json',
        description: 'Geojson with damage to manzanas',
    },
    value: null
};

export const damageBuildings: WpsData & Product = {
    uid: 'FlooddamageProcess_damageBuildings',
    description: {
        id: 'damage_buildings',
        title: 'damage_buildings',
        reference: false,
        type: 'complex',
        format: 'application/json',
        description: 'Geojson with damage to buildings'
    },
    value: null
};



export const damageManzanasGeojson: VectorLayerProduct & WpsData & Product = {
    uid: 'damageManzanasGeojson',
    description: {
        id: 'damage_manzanas',
        title: 'damage_manzanas',
        icon: 'tsunami',
        reference: false,
        type: 'complex',
        format: 'application/vnd.geo+json',
        description: 'floodDamageDescription',
        name: 'Flood damage',
        vectorLayerAttributes: {
            style: (feature: olFeature<Geometry>, resolution: number) => {
                const props = feature.getProperties();
                const inundation = props['inundation'];
                let [r, g, b] = greenRedRange(0, 50, inundation);

                return new olStyle({
                  fill: new olFill({
                    color: [r, g, b, 0.3],
                  }),
                  stroke: new olStroke({
                    color: [r, g, b, 1],
                    width: 2
                  })
                });
              },
              text: (props: object) => {
                const anchor = document.createElement('div');

                const counts = {
                    'D1': props['proba_d1_predicted'],
                    'D2': props['proba_d2_predicted'],
                    'D3': props['proba_d3_predicted'],
                    'D4': props['proba_d4_predicted']
                };
                const data: BarData[] = [];
                for (const damageClass in counts) {
                    data.push({label: damageClass, value: counts[damageClass]});
                }
                const anchorUpdated = createBarChart(anchor, data, 300, 200, '{{ probability_of_damage_state }}', '{{ Probability }}', {yRange: [0, 1]});
                return `<h4>{{ updated_exposure_flood }}</h4>${anchor.innerHTML}`;
              },
              legendEntries: [{
                  feature: {
                      "type": "Feature",
                      "properties": {'inundation': 10},
                      "geometry": {
                        "type": "Polygon",
                        "coordinates": [ [
                            [ 5.627918243408203, 50.963075942052164 ],
                            [ 5.627875328063965, 50.958886259879264 ],
                            [ 5.635471343994141, 50.95634523633128 ],
                            [ 5.627918243408203, 50.963075942052164 ] ] ]
                      }
                  },
                  text: 'Inundation_10_cm'
              }, {
                feature: {
                    "type": "Feature",
                    "properties": {'inundation': 30},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Inundation_30_cm'
            }, {
                feature: {
                    "type": "Feature",
                    "properties": {'inundation': 50},
                    "geometry": {
                      "type": "Polygon",
                      "coordinates": [ [
                          [ 5.627918243408203, 50.963075942052164 ],
                          [ 5.627875328063965, 50.958886259879264 ],
                          [ 5.635471343994141, 50.95634523633128 ],
                          [ 5.627918243408203, 50.963075942052164 ] ] ]
                    }
                },
                text: 'Inundation_50_cm'
            }]
        }
    },
    value: null
};


export class FloodDamageProcess extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'FloodService',
            'Flood damage',
            [durationTiff, velocityTiff, depthTiff].map(p => p.uid),
            // [damageManzanas, damageBuildings].map(p => p.uid), // <-- damageBuildings is way too big to fit in browser memory!
            [damageManzanasGeojson].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.FlooddamageProcess',
            'Process to compute the damage caused by a flood.',
            'https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
        this.wizardProperties = {
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle',
            wikiLink: 'ExposureAndVulnerabilityEcuador'
        };
    }

    execute(inputs: Product[], outputs: Product[], doWhile): Observable<Product[]> {

        const newOutputs = outputs.filter(o => o.uid !== damageManzanasGeojson.uid);
        newOutputs.push(damageManzanas);

        return super.execute(inputs, newOutputs, doWhile).pipe(map((results) => {
            const damageManzanasResults = results.find(r => r.uid === damageManzanas.uid);
            const newResults = results.filter(r => r.uid !== damageManzanas.uid);
            const reprojected = reproject(damageManzanasResults.value[0], 'EPSG:32717', 'EPSG:4326');
            newResults.push({
                ... damageManzanasGeojson,
                value:  [reprojected]
            });
            return newResults;
        }));
    }

}


function reproject(featureCollection: FeatureCollection<MultiPolygon | Polygon, any>, fromProj: string, toProj: string): FeatureCollection {
    featureCollection.features.map(f => {
        if (f.geometry.type === 'Polygon') {
            for (let setNr = 0;  setNr < f.geometry.coordinates.length; setNr++) {
                const set = f.geometry.coordinates[setNr];
                for (let pairNr = 0; pairNr < set.length; pairNr++) {
                    const pair = set[pairNr];
                    f.geometry.coordinates[setNr][pairNr] = proj4(fromProj, toProj, pair);
                }
            }
        } else if (f.geometry.type === 'MultiPolygon') {
            for (let setNr = 0;  setNr < f.geometry.coordinates.length; setNr++) {
                const set = f.geometry.coordinates[setNr];
                for (let subsetNr = 0; subsetNr < set.length; subsetNr++) {
                    const subset = set[subsetNr];
                    for (let pairNr = 0; pairNr < subset.length; pairNr++) {
                        const pair = subset[pairNr];
                        f.geometry.coordinates[setNr][subsetNr][pairNr] = proj4(fromProj, toProj, pair);
                    }
                }
            }
        }
        return f;
    });
    return featureCollection;
}
