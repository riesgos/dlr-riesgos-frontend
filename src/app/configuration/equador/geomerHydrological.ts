import { CustomProcess, ProcessStateUnavailable, Product, WatchingProcess, ProcessStateAvailable } from 'src/app/wps/wps.datatypes';
import { WizardableProcess } from 'src/app/components/config_wizard/wizardable_processes';
import { WmsLayerData } from 'src/app/components/map/mappable_wpsdata';
import { Observable, of } from 'rxjs';
import { WpsData } from 'projects/services-wps/src/public-api';
import { laharWms, direction } from './lahar';



export const hydrologicalSimulation: WmsLayerData & WpsData = {
    uid: 'geomerHydrological_hydrologicalSimulation',
    description: {
        id: 'hydrologicalSimulation',
        name: 'Hydrological Simulation',
        format: 'application/WMS',
        reference: false,
        type: 'complex',
    },
    value: null
};


export const geomerFlood: WizardableProcess & CustomProcess = {
    id: 'geomerHydrological',
    name: 'Flood',
    requiredProducts: [direction, laharWms].map(p => p.uid),
    providedProducts: [hydrologicalSimulation.uid],
    state: new ProcessStateUnavailable(),
    wizardProperties: {
        providerName: 'geomer',
        providerUrl: 'https://www.geomer.de/en/index.html',
        shape: 'tsunami'
    },
    execute: (inputs: Product[]): Observable<Product[]> => {
        const directionProduct = inputs.find(prd => prd.uid === direction.uid);
        return of([{
            ...hydrologicalSimulation,
            value: [
                'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?Service=WMS&Request=GetMap&Version=1.1.1&layers=rain_cotopaxi:duration_latacunga_city&width=351&height=409&format=image/png&bbox=-78.0,-40.0,-50.0,-1.0&srs=EPSG:4326',
                'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?Service=WMS&Request=GetMap&Version=1.1.1&layers=rain_cotopaxi:v_at_wdmax_latacunga_city&width=351&height=409&format=image/png&bbox=-78.0,-40.0,-50.0,-1.0&srs=EPSG:4326',    
                'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?Service=WMS&Request=GetMap&Version=1.1.1&layers=rain_cotopaxi:wd_max_latacunga_city&width=351&height=409&format=image/png&bbox=-78.0,-40.0,-50.0,-1.0&srs=EPSG:4326'
                // 'https://www.sd-kama.de/geoserver/rain_cotopaxi/ows?version=1.3.0&service=wms&request=GetCapabilities'
            ]
        }]);
    }
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


export const geomerFloodWcsProvider: WatchingProcess = {
    id: 'geomerFloodWcsProvider',
    name: 'geomerFloodWcsProvider',
    requiredProducts: [direction, hydrologicalSimulation].map(pr => pr.uid),
    providedProducts: [durationTiff, velocityTiff, depthTiff].map(pr => pr.uid),
    state: new ProcessStateAvailable(),
    onProductAdded: (newProduct: Product, allProducts: Product[]): Product[] => {
        switch (newProduct.uid) {
            case hydrologicalSimulation.uid:
                const directionProduct = allProducts.find(prd => prd.uid === direction.uid);
                return [{
                    ... durationTiff,
                    value: 'https://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&amp;REQUEST=GetCoverage&amp;VERSION=2.0.1&amp;CoverageId=rain_cotopaxi:duration_latacunga_city&amp;format=image/geotiff'
                }, {
                    ... velocityTiff,
                    value: 'https://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&amp;REQUEST=GetCoverage&amp;VERSION=2.0.1&amp;CoverageId=rain_cotopaxi:v_at_wdmax_latacunga_city&amp;format=image/geotiff'
                }, {
                    ... depthTiff,
                    value: 'https://www.sd-kama.de/geoserver/rain_cotopaxi/wcs?SERVICE=WCS&amp;REQUEST=GetCoverage&amp;VERSION=2.0.1&amp;CoverageId=rain_cotopaxi:wd_max_latacunga_city&amp;format=image/geotiff'
                }];
            default:
                return [];
        }
    }
}