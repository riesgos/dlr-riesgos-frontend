import { WizardPageComponent } from 'src/app/components/config_wizard/wizard-page/wizard-page.component';
import { WpsProcess, ProcessStateUnavailable, Product, AutorunningProcess } from 'src/app/wps/wps.datatypes';
import { WizardableProcess, WizardProperties } from 'src/app/components/config_wizard/wizardable_processes';
import { WpsData } from 'projects/services-wps/src/public-api';
import { durationTiff, velocityTiff, depthTiff } from './geomerHydrological';
import { VectorLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';
import { FeatureCollection, feature, MultiPolygon, Polygon } from '@turf/helpers';
import proj4 from 'proj4';  // requires "allowSyntheticDefaultImports": true
import { HttpClient } from '@angular/common/http';


proj4.defs('EPSG:32717', '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs');
// proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs'); <-- already known


export const damageManzanas: WpsData & Product = {
    uid: 'FlooddamageProcess_damageManzanas',
    description: {
        id: 'damage_manzanas',
        reference: false,
        type: 'complex',
        format: 'application/json',
        description: 'geojson with the damage of the manzanas',
    },
    value: null
};

export const damageBuildings: WpsData & Product = {
    uid: 'FlooddamageProcess_damageBuildings',
    description: {
        id: 'damage_buildings',
        reference: false,
        type: 'complex',
        format: 'application/json',
        description: 'geojson with the damage on the buildings'
    },
    value: null
};


export class FlooddamageProcess extends WpsProcess implements WizardableProcess {
    
    readonly wizardProperties: WizardProperties;

    constructor(http: HttpClient) {
        super(
            'FloodService',
            'Flood damage',
            [durationTiff, velocityTiff, depthTiff].map(p => p.uid),
            // [damageManzanas, damageBuildings].map(p => p.uid), // <-- damageBuildings is way too big to fit in browser memory!
            [damageManzanas].map(p => p.uid),
            'org.n52.gfz.riesgos.algorithm.impl.FlooddamageProcess',
            'Process to compute the damage of a flood in ecuador.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
        );
        this.wizardProperties = {
            providerName: 'Helmholtz Centre Potsdam',
            providerUrl: 'https://www.gfz-potsdam.de/en/',
            shape: 'dot-circle'
        }
    }

};

export const damageManzanasGeojson: VectorLayerData & WpsData & Product = {
    uid: 'damageManzanasGeojson',
    description: {
        id: 'damage_manzanas',
        icon: 'tsunami',
        reference: false,
        type: 'complex',
        format: 'application/vnd.geo+json',
        description: 'geojson with the damage of the manzanas',
        name: 'Flood damage',
        vectorLayerAttributes: {
            style: (feature: olFeature, resolution: number) => {
                const props = feature.getProperties();
                return new olStyle({
                  fill: new olFill({
                    color: [255, 0, 0, 0.3],
                  }),
                  stroke: new olStroke({
                    color: [255, 0, 0, 1],
                    witdh: 2
                  })
                });
              },
              text: (props: object) => {
                return JSON.stringify(props);
              }
        }
    },
    value: null
};

/**
 * translates Flooddamage's output: needs to be converted to proper coodinate system to be actual geojson.
 */
export const FlooddamageTranslator: AutorunningProcess = {
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
