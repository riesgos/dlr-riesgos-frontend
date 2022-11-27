import { Feature, Point } from "geojson";
import { WpsClient, WpsInput, WpsOutputDescription } from "../utils/wps/public-api";


const wpsClient1 = new WpsClient('1.0.0');
const wpsClient2 = new WpsClient('2.0.0');


export type CatalogType =  'observed' | 'deaggregation' | 'stochastic' | 'expert';

export interface Bbox {
    crs: 'EPSG:4326',
    lllon: number,
    lllat: number,
    urlon: number,
    urlat: number,
}

export async function getAvailableEqs(catalogType: CatalogType, bbox: Bbox) {

    const url = `https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService`;
    const processId = 'org.n52.gfz.riesgos.algorithm.impl.QuakeledgerProcess';

    const inputs: WpsInput[] = [{
        description: {
            id: 'input-boundingbox',
            type: 'bbox',
            reference: false
        },
        value: bbox
    }, {
        description: {
            id: 'mmin',
            type: 'literal',
            reference: false
        },
        value: '6.0'
    }, {
        description: {
            id: 'mmax',
            type: 'literal',
            reference: false
        },
        value: '9.5'
    }, {
        description: {
            id: 'zmin',
            type: 'literal',
            reference: false
        },
        value: '0'
    }, {
        description: {
            id: 'zmax',
            type: 'literal',
            reference: false
        },
        value: '100'
    }, {
        description: {
            id: 'p',
            type: 'literal',
            reference: false
        },
        value: '0.0'
    }, {
        description: {
            id: 'etype',
            reference: false,
            type: 'literal',
        },
        value: catalogType
    }, {
        description: {
            id: 'tlon',
            reference: false,
            type: 'literal'
        },
        value: '-77.00'
    }, {
        description: {
            id: 'tlat',
            reference: false,
            type: 'literal'
        },
        value: '-12.00'
    }];

    const outputs: WpsOutputDescription[] = [{
        id: 'selectedRows',
        reference: false,
        type: 'complex',
        format: 'application/vnd.geo+json'
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return results[0].value[0];
}


export type Vsgrid = 'USGSSlopeBasedTopographyProxy' | 'FromSeismogeotechnicsMicrozonation';
export type Gmpe = 'MontalvaEtAl2016SInter' | 'GhofraniAtkinson2014' | 'AbrahamsonEtAl2015SInter' | 'YoungsEtAl1997SInterNSHMP2008';


/**
 * Calls shakyground
 */
export async function getEqSim( gmpe: Gmpe, vsgrid: Vsgrid, selectedEq: any) {

    const url = `https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService`;
    const processId = 'org.n52.gfz.riesgos.algorithm.impl.ShakygroundProcess';

    const wpsInputs: WpsInput[] = [{
        description: {
            id: 'quakeMLFile',
            reference: false,
            type: 'complex',
            format: 'application/vnd.geo+json'
        },
        value: selectedEq
    }, {
        description: {
            id: 'gmpe',
            reference: false,
            type: "literal",
        },
        value: gmpe
    }, {
        description: {
            id: 'vsgrid',
            reference: false,
            type: 'literal'
        },
        value: vsgrid
    }];

    const wpsOutputs: WpsOutputDescription[] = [{
        id: 'shakeMapFile',
        reference: false,
        type: 'complex',
        format: 'application/WMS'
    }, {
        id: 'shakeMapFile',
        reference: true,
        type: 'complex',
        format: 'text/xml'
    }];

    const results = await wpsClient1.executeAsync(url, processId, wpsInputs, wpsOutputs);

    return {
        wms: results.find(r => r.description.format === 'application/WMS')?.value[0],
        xml: results.find(r => r.description.format === 'text/xml')?.value
    };
}





export type Schema = "SARA_v1.0" |"HAZUS_v1.0" |"SUPPASRI2013_v2.0" |"Mavrouli_et_al_2014" |"Torres_Corredor_et_al_2017" |"Medina_2019";

/**
 * Calls Modelprop
 */
export async function getFragility(schemaName: Schema) {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService";
    const processId = "org.n52.gfz.riesgos.algorithm.impl.ModelpropProcess";

    const inputs: WpsInput[] = [{
        description: {
            id: 'schema',
            reference: false,
            type: 'literal'
        },
        value: schemaName
    }, {
        description: {
            id: 'assetcategory',
            reference: false,
            type: 'literal'
        },
        value: 'buildings'
    }, {
        description: {
            id: 'losscategory',
            reference: false,
            type: 'literal'
        },
        value: 'structural'
    }, {
        description: {
            id: 'taxonomies',
            reference: false,
            type: 'literal'
        },
        value: 'none'
    }];

    const outputs: WpsOutputDescription[] = [{
        id: 'selectedRows',
        type: 'complex',
        reference: true,
        format: 'application/json'
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return results[0].value;
}



export type ExposureModel =  "ValpCVTBayesian" | "ValpCommuna" | "ValpRegularOriginal" | "ValpRegularGrid" | "LimaCVT1_PD30_TI70_5000" | "LimaCVT2_PD30_TI70_10000" | "LimaCVT3_PD30_TI70_50000" | "LimaCVT4_PD40_TI60_5000" | "LimaCVT5_PD40_TI60_10000" | "LimaCVT6_PD40_TI60_50000" | "LimaBlocks" | "LatacungaRuralAreas";


/**
 * Calls Assetmaster
 */
export async function getExposureModel(modelName: ExposureModel, schemaName: Schema, bbox: Bbox) {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService";
    const processId = "org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess";


    // bounding box: covering all study-areas (Chile, Ecuador, Peru)
    const lonmin: WpsInput = {
        description: {
            id: 'lonmin',
            reference: false,
            type: 'literal'
        },
        value: bbox.lllon + ''
    };
    const lonmax: WpsInput = {
        description: {
            id: 'lonmax',
            reference: false,
            type: 'literal'
        },
        value: bbox.urlon + ''
    };
    const latmin: WpsInput = {
        description: {
            id: 'latmin',
            reference: false,
            type: 'literal'
        },
        value: bbox.lllat + ''
    };
    const latmax: WpsInput = {
        description: {
            id: 'latmax',
            reference: false,
            type: 'literal'
        },
        value: bbox.urlat + ''
    };


    const inputs: WpsInput[] = [{
        description: {
            id: 'model',
            reference: false,
            type: 'literal'
        },
        value: modelName
    }, {
        description: {
            id: 'schema',
            reference: false,
            type: 'literal'
        },
        value: schemaName
    },
    lonmin, lonmax, latmin, latmax,
    {
        description: {
            id: 'assettype',
            type: 'literal',
            reference: false
        },
        value: 'res'
    }, {
        description: {
            id: 'querymode',
            type: 'literal',
            reference: false
        },
        value: 'intersects'
    }];

    const outputs: WpsOutputDescription[] = [{
        id: 'selectedRowsGeoJson',
        type: 'complex',
        reference: false,
        format: 'application/json'
    }, {
        id: 'selectedRowsGeoJson',
        type: 'complex',
        reference: true,
        format: 'application/json'
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return {
        exposureModel: results.find(r => r.description.reference === false)!.value[0],
        exposureRef: results.find(r => r.description.reference === true)!.value,
    };
}


/**
 * Calls Deus
 */
export async function getDamage(schemaName: Schema, fragilityRef: string, intensityXMLRef: string, exposureRef: string) {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService";
    const processId = "org.n52.gfz.riesgos.algorithm.impl.DeusProcess";

    const inputs: WpsInput[] = [{
        description: {
            id: 'intensity',
            reference: true,
            type: 'complex',
            format: 'text/xml'
        },
        value: intensityXMLRef
    }, {
        description: {
            id: 'exposure',
            reference: true,
            type: 'complex',
            format: 'application/json'
        },
        value: exposureRef
    }, {
        description: {
            id: 'fragility',
            reference: true,
            type: 'complex',
            format: 'application/json'
        },
        value: fragilityRef
    }, {
        description: {
            id: 'schema',
            reference: false,
            type: 'literal'
        },
        value: schemaName
    }];

    const outputs: WpsOutputDescription[] = [{
        id: 'shapefile_summary',
        type: 'complex',
        reference: false,
        format: 'application/WMS'
    }, {
        id: 'meta_summary',
        type: 'complex',
        reference: false,
        format: 'application/json'
    }, {
        id: 'merged_output',
        reference: true,
        type: 'complex',
        format: 'application/json'
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return {
        wms: results.find(r => r.description.id === 'shapefile_summary')?.value[0],
        summary: results.find(r => r.description.id === 'meta_summary')?.value[0],
        damageRef: results.find(r => r.description.id === 'merged_output')?.value
    };
}




export async function getNeptunusTsunamiDamage(schemaName: Schema, fragilityRef: string, intensityGeotiffUrl: string, updatedExposureRef: string) {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService";
    const processId = "org.n52.gfz.riesgos.algorithm.impl.NeptunusProcess";

    const inputs: WpsInput[] = [{
        description: {
            id: 'intensity',
            reference: true,
            type: 'complex',
            format: 'image/geotiff'
        },
        value: intensityGeotiffUrl
    }, {
        description: {
            id: 'exposure',
            reference: true,
            type: 'complex',
            format: 'application/json'
        },
        value: updatedExposureRef
    }, {
        description: {
            id: 'fragility',
            reference: true,
            type: 'complex',
            format: 'application/json'
        },
        value: fragilityRef
    }, {
        description: {
            id: 'schema',
            reference: false,
            type: 'literal'
        },
        value: schemaName
    }, {
        description: {
            id: 'intensityname',
            title: '',
            type: 'literal',
            reference: false,
        },
        value: 'MWH'
    }, {
        description: {
            id: 'intensityunit',
            title: '',
            reference: false,
            type: 'literal'
        },
        value: 'm'
    }];

    const outputs: WpsOutputDescription[] = [{
        id: 'shapefile_summary',
        type: 'complex',
        reference: false,
        format: 'application/WMS'
    }, {
        id: 'meta_summary',
        type: 'complex',
        reference: false,
        format: 'application/json'
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return {
        wms: results.find(r => r.description.id === 'shapefile_summary')?.value[0],
        summary: results.find(r => r.description.id === 'meta_summary')?.value[0]
    };
}





export async function getTsunami(selectedEq: Feature<Point, any>) {

    const url = "https://riesgos.52north.org/wps";
    const processId = "get_scenario";

    const lat: WpsInput = {
        description: {
            id: 'lat',
            title: 'lat',
            reference: false,
            type: 'literal',
        },
        value: selectedEq.geometry.coordinates[1]
    };
    const lon: WpsInput = {
        description: {
            id: 'lon',
            title: 'lon',
            reference: false,
            type: 'literal',
        },
        value: selectedEq.geometry.coordinates[0]
    };
    const mag: WpsInput = {
        description: {
            id: 'mag',
            title: 'mag',
            reference: false,
            type: 'literal',
        },
        value: selectedEq.properties['magnitude.mag.value']
    };

    const wmsOutput: WpsOutputDescription = {
        id: 'epiCenter',
        title: 'epiCenter',
        reference: false,
        format: 'string',
        type: 'literal',
    }


    const results = await wpsClient1.executeAsync(url, processId, [lat, lon, mag], [wmsOutput]);

    return results[0].value;
}



export async function getSystemReliability(countryName: 'peru' | 'chile' | 'ecuador', intensityRef: string) {

    const url = 'https://riesgos.52north.org/javaps/service';
    const processId = 'org.n52.gfz.riesgos.algorithm.impl.SystemReliabilitySingleProcess';

    const country: WpsInput = {
        description: {
            id: 'country',
            title: '',
            defaultValue: 'chile',
            description: 'What country are we working in?',
            reference: false,
            type: 'literal',
            format: 'text/plain'
        },
        value: countryName
    };

    const hazardType: WpsInput = {
        description: {
            id: 'hazard',
            title: 'hazard',
            defaultValue: 'earthquake',
            description: 'What hazard are we dealing with?',
            options: ['earthquake', 'lahar'],
            reference: false,
            type: 'literal',
            format: 'text/plain'
        },
        value: countryName === 'ecuador' ? 'lahar' : 'earthquake'
    }

    const intensityData: WpsInput = {
        description: {
            id: 'intensity',
            type: 'complex',
            reference: true,
            format: 'text/xml',
            schema: 'http://earthquake.usgs.gov/eqcenter/shakemap',
            encoding: 'UTF-8'
        },
        value: intensityRef
    }

    const damageData: WpsOutputDescription = {
        id: 'damage_consumer_areas',
        title: 'damage_consumer_areas',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex',
    };

    const results = await wpsClient2.executeAsync(url, processId, [country, hazardType, intensityData], [damageData]);

    return results[0].value;
}