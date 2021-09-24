import { WpsProcess, ProcessStateUnavailable, Product, ProductTransformingProcess } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from '@dlr-eoc/utils-ogc';
import { durationTiff, velocityTiff, depthTiff } from './geomerHydrological';
import { VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { FeatureCollection, MultiPolygon, Polygon } from '@turf/helpers';
import proj4 from 'proj4';  // requires "allowSyntheticDefaultImports": true
import { HttpClient } from '@angular/common/http';
import { greenRedRange } from 'src/app/helpers/colorhelpers';
import { BarData, createBarchart } from 'src/app/helpers/d3charts';
import { Cache } from '@dlr-eoc/utils-ogc';


proj4.defs('EPSG:32717', '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs');
// proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs'); <-- already known


export const damageManzanas: WpsData & Product = {
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


export class FlooddamageProcess extends WpsProcess implements WizardableProcess {

    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient, cache: Cache) {
        super(
            'FloodService',
            'Flood damage',
            [durationTiff, velocityTiff, depthTiff].map(p => p.uid),
            // [damageManzanas, damageBuildings].map(p => p.uid), // <-- damageBuildings is way too big to fit in browser memory!
            [damageManzanas].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.FlooddamageProcess',
            'Process to compute the damage caused by a flood.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
        this.wizardProperties = {
            providerName: 'GFZ',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle',
            wikiLink: 'FloodWiki'
        };
    }

}

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
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                const inundation = props['inundation'];
                let [r, g, b] = greenRedRange(0, 50, inundation);

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
                const anchor = document.createElement('div');

                const counts = {
                    'Prob. D1': props['proba_d1_predicted'],
                    'Prob. D2': props['proba_d2_predicted'],
                    'Prob. D3': props['proba_d3_predicted'],
                    'Prob. D4': props['proba_d4_predicted']
                };
                const data: BarData[] = [];
                for (const damageClass in counts) {
                    data.push({label: damageClass, value: counts[damageClass]});
                }
                const anchorUpdated = createBarchart(anchor, data, 300, 200, '{{ Damage_state }}', '{{ Probability }}');
                return `<h4>{{ Updated_exposure }}</h4>${anchor.innerHTML}`;
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
                  text: 'Inundation 10 cm'
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
                text: 'Inundation 30 cm'
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
                text: 'Inundation 50 cm'
            }]
        }
    },
    value: null
};

/**
 * translates Flooddamage's output: needs to be converted to proper coordinate system to be actual geojson.
 */
export const FlooddamageTranslator: ProductTransformingProcess = {
    uid: 'ecuadorFlooddamageTranslator',
    name: 'ecuadorFlooddamageTranslator',
    requiredProducts: [damageManzanas].map(p => p.uid),
    providedProducts: [damageManzanasGeojson].map(p => p.uid),
    state: new ProcessStateUnavailable(),
    onProductAdded: (newProd: Product, allProds: Product[]): Product[] => {
        if (newProd.uid === damageManzanas.uid) {
            const reprojected = reproject(newProd.value[0], 'EPSG:32717', 'EPSG:4326');
            return [{
                ... damageManzanasGeojson,
                value: [reprojected]
            }];
        }
        return [];
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
