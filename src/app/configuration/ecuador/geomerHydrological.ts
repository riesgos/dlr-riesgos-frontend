import { ExecutableProcess, ProcessStateUnavailable, Product, AutorunningProcess, ProcessStateAvailable } from 'src/app/riesgos/riesgos.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WmsLayerProduct, VectorLayerProduct } from 'src/app/riesgos/riesgos.datatypes.mappable';
import { Observable, of } from 'rxjs';
import { WpsData } from '@ukis/services-ogc';
import { laharWms, direction, vei, laharShakemap } from './lahar';
import { laharHeightWms } from './laharWrapper';
import { FeatureSelectUconfProduct, StringUconfProduct, StringSelectUconfProduct } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { toDecimalPlaces } from 'src/app/helpers/colorhelpers';
import { Style as olStyle, Fill as olFill, Stroke as olStroke, Circle as olCircle, Text as olText } from 'ol/style';
import { Feature as olFeature } from 'ol/Feature';


export const hydrologicalSimulation: WmsLayerProduct & WpsData = {
    uid: 'geomerHydrological_hydrologicalSimulation',
    description: {
        id: 'hydrologicalSimulation',
        icon: 'tsunami',
        name: 'Hydrological Simulation',
        format: 'application/WMS',
        reference: false,
        type: 'complex',
    },
    value: null
};




export const durationTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_duration',
    description: {
        id: 'duration-h',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the duration of the flood in hours'
    },
    value: null
};

export const velocityTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_velocity',
    description: {
        id: 'vsmax-ms',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the maximum velocity of the flood in m/s'
    },
    value: null
};

export const depthTiff: WpsData & Product = {
    uid: 'FlooddamageProcess_depth',
    description: {
        id: 'wdmax-cm',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        description: 'Tiff file with the maximum water depth of the flood in cm'
    },
    value: null
};




export const userinputSelectedOutburst: StringSelectUconfProduct & WpsData = {
    uid: 'outburstSite',
    description: {
        id: 'outburstSite',
        type: 'literal',
        reference: false,
        options: ['Rio San Pedro', 'Rio Pita'],
        defaultValue: 'Rio San Pedro',
        wizardProperties: {
            fieldtype: 'stringselect',
            name: 'outburstSite',
            description: 'outburstSite',
            signpost: 'You can choose here from two lake locations. The process will create the flood scenario for the selected lake.'
        }
    },
    value: null
};


export const FloodMayRun: Product = {
    uid: 'floodMayRun',
    description: {},
    value: null
};

export const FloodMayRunProcess: AutorunningProcess = {
    name: 'floodMayRunChecker',
    requiredProducts: [],
    providedProducts: [FloodMayRun.uid],
    state: new ProcessStateUnavailable(),
    uid: 'floodMayRunProcess',
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        if (newProduct.uid === direction.uid) {
            if (newProduct.value === 'North') {
                return [{
                    ... FloodMayRun,
                    value: true
                }];
            } else {
                return [{
                    ... FloodMayRun,
                    value: null
                }];
            }
        } else {
            return [];
        }
    }
};


export const geomerFlood: WizardableProcess & ExecutableProcess = {
    uid: 'geomerFlood',
    name: 'Flood',
    requiredProducts: [vei, laharHeightWms, userinputSelectedOutburst, FloodMayRun].map(p => p.uid),
    providedProducts: [hydrologicalSimulation, durationTiff, velocityTiff, depthTiff].map(pr => pr.uid),  // durationTiff, velocityTiff,
    state: new ProcessStateUnavailable(),
    wizardProperties: {
        providerName: 'geomer',
        providerUrl: 'https://www.geomer.de/en/index.html',
        shape: 'tsunami',
    },
    description: 'This service provides the option to simulate a break of a lake created by a lahar.',
    execute: (inputs: Product[]): Observable<Product[]> => {
        const veiVal = inputs.find(prd => prd.uid === vei.uid).value.toLowerCase();
        const outburstVal = inputs.find(prd => prd.uid === userinputSelectedOutburst.uid);
        const position = outburstVal.value === 'Rio San Pedro' ? 'north' : 'south';

        if (veiVal === 'vei1') {
            return of([]);
        }

        const hydSimVal = {
            ...hydrologicalSimulation,
            value: [
                    `https://www.sd-kama.de/geoserver/flood_vei/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&LAYERS=wd_max_${veiVal}_${position}&WIDTH=256&HEIGHT=256&BBOX=0,-77.34375,1.40625,-75.9375&SRS=AUTO:42001&STYLES=&CRS=EPSG:4326`,
            ]
        };
        
        const durationTiffVal = {
            ... durationTiff,
            value: `http://www.sd-kama.de/geoserver/flood_vei/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=flood_vei:duration_${veiVal}_${position}&format=image/geotiff`
        };

        const velocityTiffVal = {
            ... velocityTiff,
            value: `http://www.sd-kama.de/geoserver/flood_vei/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=flood_vei:v_atwdmax_${veiVal}_${position}&format=image/geotiff`
        };

        const depthTiffVal = {
            ... depthTiff,
            value: `http://www.sd-kama.de/geoserver/flood_vei/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=flood_vei:wd_max_${veiVal}_${position}&format=image/geotiff`,
        };

        return of([hydSimVal, durationTiffVal, velocityTiffVal, depthTiffVal]);
    }
};
