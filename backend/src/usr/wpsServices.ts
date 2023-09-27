import { Feature, FeatureCollection, Point } from "geojson";
import { WpsClient, WpsInput, WpsOutputDescription } from "../utils/wps/public-api";
import config from "../config.json";


const wpsClient1 = new WpsClient('1.0.0');
const wpsClient2 = new WpsClient('2.0.0');


export type CatalogType = 'observed' | 'deaggregation' | 'stochastic' | 'expert';

export interface Bbox {
    crs: 'EPSG:4326',
    lllon: number,
    lllat: number,
    urlon: number,
    urlat: number,
}

export async function getAvailableEqs(catalogType: CatalogType, bbox: Bbox, mmin?: string, mmax?: string, zmin?: string, zmax?: string, p?: string) {

    const url = config.services.EqCatalog.url;
    const processId = config.services.EqCatalog.id;

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
        value: mmin ?? '6.0'
    }, {
        description: {
            id: 'mmax',
            type: 'literal',
            reference: false
        },
        value: mmax ?? '9.5'
    }, {
        description: {
            id: 'zmin',
            type: 'literal',
            reference: false
        },
        value: zmin ?? '0'
    }, {
        description: {
            id: 'zmax',
            type: 'literal',
            reference: false
        },
        value: zmax ?? '100'
    }, {
        description: {
            id: 'p',
            type: 'literal',
            reference: false
        },
        value: p ?? '0.0'
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
export async function getEqSim(gmpe: Gmpe, vsgrid: Vsgrid, selectedEq: any) {

    const url = config.services.EqSim.url;
    const processId = config.services.EqSim.id;

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
    }, {
        id: 'shakeMapFile',
        reference: true,
        type: 'complex',
        format: 'image/geotiff',
        encoding: 'base64'
    }];

    const results = await wpsClient1.executeAsync(url, processId, wpsInputs, wpsOutputs);

    return {
        wms: results.find(r => r.description.format === 'application/WMS')?.value[0],
        xml: results.find(r => r.description.format === 'text/xml')?.value,
        geotiffRef: results.find(r => r.description.format === 'image/geotiff')?.value
    };
}





export type Schema = "SARA_v1.0" | "HAZUS_v1.0" | "SUPPASRI2013_v2.0" | "Mavrouli_et_al_2014" | "Torres_Corredor_et_al_2017" | "Medina_2019";

/**
 * Calls Modelprop
 */
export async function getFragility(schemaName: Schema) {

    const url = config.services.Fragility.url;
    const processId = config.services.Fragility.id;

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



export type ExposureModel = "ValpCVTBayesian" | "ValpCommuna" | "ValpRegularOriginal" | "ValpRegularGrid" | "LimaCVT1_PD30_TI70_5000" | "LimaCVT2_PD30_TI70_10000" | "LimaCVT3_PD30_TI70_50000" | "LimaCVT4_PD40_TI60_5000" | "LimaCVT5_PD40_TI60_10000" | "LimaCVT6_PD40_TI60_50000" | "LimaBlocks" | "LatacungaRuralAreas";


/**
 * Calls Assetmaster
 */
export async function getExposureModel(modelName: ExposureModel, schemaName: Schema, bbox: Bbox) {

    const url = config.services.Exposure.url;
    const processId = config.services.Exposure.id;


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

    const url = config.services.Deus.url;
    const processId = config.services.Deus.id;

    const inputs: WpsInput[] = [{
        description: {
            id: 'intensity',
            reference: true,
            type: 'complex',
            format: 'text/xml; subtype=gml/2.1.2'
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
        format: 'application/WMS',
        encoding: 'UTF-8'
    }, {
        id: 'shapefile_summary',
        type: 'complex',
        reference: true,
        format: 'application/x-zipped-shp',
        encoding: 'base64'
    }, {
        id: 'meta_summary',
        type: 'complex',
        reference: false,
        format: 'application/json',
        encoding: 'UTF-8'
    }, {
        id: 'merged_output',
        reference: true,
        type: 'complex',
        format: 'application/json',
        encoding: 'UTF-8'
    }];


    // const executeUrl = wpsClient2.wpsMarshaller.executeUrl(url, processId);
    // const execBody = wpsClient2.wpsMarshaller.marshalExecBody(processId, inputs, outputs, false);
    // const xmlExecBody = wpsClient2.xmlMarshaller.marshalString(execBody);
    // const success = await writeTextFile("body3.xml", xmlExecBody)

    const results = await wpsClient2.executeAsync(url, processId, inputs, outputs);
// @TODO: wms and shapefile are assigned the same output-description.
    return {
        wms: results.find(r => r.description.id === 'shapefile_summary' && r.description.format === 'application/WMS')?.value[0],
        shapefile: results.find(r => r.description.id === 'shapefile_summary' && r.description.format === 'application/x-zipped-shp')?.value,
        summary: results.find(r => r.description.id === 'meta_summary')?.value[0],
        damageRef: results.find(r => r.description.id === 'merged_output')?.value
    };
}



export async function getDamageJsonEcuador(schemaName: Schema, fragilityRef: string, intensityXMLRef: string, exposureRef: string) {

    const url = config.services.Deus.url;
    const processId = config.services.Deus.id;

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
        id: 'merged_output',
        type: 'complex',
        reference: false,
        format: 'application/json'
    }, {
        id: 'merged_output',
        reference: true,
        type: 'complex',
        format: 'application/json'
    }, {
        id: 'meta_summary',
        type: 'complex',
        reference: false,
        format: 'application/json'
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return {
        json: results.find(r => r.description.id === 'merged_output' && r.description.reference === false)?.value[0],
        damageRef: results.find(r => r.description.id === 'merged_output' && r.description.reference === true)?.value,
        summary: results.find(r => r.description.id === 'meta_summary')?.value[0],
    };
}



export async function getNeptunusTsunamiDamage(schemaName: Schema, fragilityRef: string, intensityGeotiffUrl: string, updatedExposureRef: string) {

    const url = config.services.Neptunus.url;
    const processId = config.services.Neptunus.id;

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
        id: 'shapefile_summary',
        type: 'complex',
        reference: true,
        format: 'application/x-zipped-shp',
        encoding: 'base64'
    }, {
        id: 'merged_output',
        reference: true,
        type: 'complex',        
        format: 'application/json'
    },  {
        id: 'meta_summary',
        type: 'complex',
        reference: false,
        format: 'application/json',
        encoding: 'UTF-8'
    }];

    const results = await wpsClient2.executeAsync(url, processId, inputs, outputs);

    return {
        wms: results.find(r => r.description.id === 'shapefile_summary' && r.description.format === "application/WMS")?.value[0],
        shapefile: results.find(r => r.description.id === 'shapefile_summary' && r.description.format === "application/x-zipped-shp")?.value,
        summary: results.find(r => r.description.id === 'meta_summary')?.value[0],
        damageRef: results.find(r => r.description.id === 'merged_output' && r.description.reference === true)?.value,
    };
}


export async function getVolcanusAshfallDamage(intensityValue: FeatureCollection<Point, any>, exposureRef: string, vulnerabilityRef: string) {

    const url = config.services.Volcanus.url;
    const processId = config.services.Volcanus.id;

    const intensity: WpsInput = {
        description: {
            id: 'intensity',
            reference: false,
            format: 'application/vnd.geo+json',
            type: 'complex'
        },
        value: intensityValue
    };

    const intensityColumn: WpsInput = {
        description: {
            id: 'intensitycolumn',
            reference: false,
            type: 'literal'
        },
        value: 'load'
    };

    const exposure: WpsInput = {
        description: {
            id: 'exposure',
            reference: true,
            type: 'complex',
            format: 'application/json'
        },
        value: exposureRef
    };

    const schema: WpsInput = {
        description: {
            id: 'schema',
            reference: false,
            type: 'literal',
        },
        value: 'Torres_Corredor_et_al_2017'
    };

    const fragility: WpsInput = {
        description: {
            id: 'fragility',
            reference: true,
            type: 'complex',
            format: 'application/json'
        },
        value: vulnerabilityRef
    };

    const ashfallDamage: WpsOutputDescription = {
        id: 'merged_output',
        reference: false,
        type: 'complex',
        format: 'application/json',
    };

    const ashfallDamageRef: WpsOutputDescription = {
        id: 'merged_output',
        title: '',
        reference: true,
        type: 'complex',
        format: 'application/json'
    };

    const results = await wpsClient1.executeAsync(url, processId, [intensity, intensityColumn, exposure, schema, fragility], [ashfallDamage, ashfallDamageRef]);

    return {
        damage: results.find(r => r.description.reference === false)?.value[0],
        damageRef: results.find(r => r.description.reference === true)?.value
    };
}


export async function getTsunami(selectedEq: Feature<Point, any>) {

    const url = config.services.Tsunami.url;
    const processId = config.services.Tsunami.id;

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

    const url = config.services.Sysrel.url;
    const processId = config.services.Sysrel.id;

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

    return results[0].value[0];
}


export async function getSystemReliabilityEcuador(heightXmlRef: string, velocityXmlRef: string) {

    const url = config.services.SysrelEcuador.url;
    const processId = config.services.SysrelEcuador.id;

    const country: WpsInput = {
        description: {
            id: 'country',
            reference: false,
            type: 'literal',
            format: 'text/plain'
        },
        value: 'ecuador'
    };

    const hazardType: WpsInput = {
        description: {
            id: 'hazard',
            reference: false,
            type: 'literal',
            format: 'text/plain'
        },
        value: 'lahar'
    }

    const heightInput: WpsInput = {
        description: {
            id: 'height',
            type: 'complex',
            reference: true,
            format: 'text/xml',
            schema: 'http://earthquake.usgs.gov/eqcenter/shakemap',
            encoding: 'UTF-8'
        },
        value: heightXmlRef
    };

    const velocityInput: WpsInput = {
        description: {
            id: 'velocity',
            type: 'complex',
            reference: true,
            format: 'text/xml',
            schema: 'http://earthquake.usgs.gov/eqcenter/shakemap',
            encoding: 'UTF-8'
        },
        value: velocityXmlRef
    };

    const damageData: WpsOutputDescription = {
        id: 'damage_consumer_areas',
        format: 'application/vnd.geo+json',
        reference: false,
        type: 'complex'
    };

    const results = await wpsClient2.executeAsync(url, processId, [country, hazardType, heightInput, velocityInput], [damageData]);

    return results[0].value[0];
}



export type LaharDirection = 'North' | 'South';
export type LaharParameter = 'MaxHeight' | 'MaxVelocity' | 'MaxPressure' | 'MaxErosion' | 'Deposition';

export async function getLahar(directionValue: LaharDirection, veiValue: number) {

    const url = config.services.Lahar.url;
    const processId = config.services.Lahar.id;

    const direction: WpsInput = {
        description: {
            id: 'direction',
            type: 'literal',
            reference: false
        },
        value: directionValue
    };

    const vei: WpsInput = {
        description: {
            id: 'intensity',
            reference: false,
            type: 'literal',
        },
        value: `VEI${veiValue}`
    };

    const parameter: WpsInput = {
        description: {
            id: 'parameter',
            reference: false,
            type: 'literal'
        },
        value: undefined
    }

    const laharWms: WpsOutputDescription = {
        id: 'wms',
        type: 'literal',
        reference: false,
        format: 'application/WMS'
    };

    const laharShakemapRef: WpsOutputDescription = {
        id: 'shakemap',
        reference: true,
        type: 'complex',
        encoding: 'UTF-8',
        format: 'application/xml',
        schema: 'http://earthquake.usgs.gov/eqcenter/shakemap',
    };



    const heightTask$ = wpsClient1.executeAsync(url, processId, [direction, vei, { ...parameter, value: 'MaxHeight' }], [laharWms, laharShakemapRef]);
    const velTask$ = wpsClient1.executeAsync(url, processId, [direction, vei, { ...parameter, value: 'MaxVelocity' }], [laharWms, laharShakemapRef]);
    const pressureTask$ = wpsClient1.executeAsync(url, processId, [direction, vei, { ...parameter, value: 'MaxPressure' }], [laharWms]);
    const erosionTask$ = wpsClient1.executeAsync(url, processId, [direction, vei, { ...parameter, value: 'MaxErosion' }], [laharWms]);

    const results = await Promise.all([heightTask$, velTask$, pressureTask$, erosionTask$]);

    return {
        heightWms: results[0].find(r => r.description.reference === false)?.value,
        heightRef: results[0].find(r => r.description.reference === true)?.value,
        velWms: results[1].find(r => r.description.reference === false)?.value,
        velRef: results[1].find(r => r.description.reference === true)?.value,
        pressureWms: results[2][0].value,
        erosionWms: results[3][0].value
    }

}

export function getLaharContourWms(directionValue: LaharDirection, veiValue: number) {

    const veiString = `VEI${veiValue}`;
    
    const vals = [];
    if (directionValue === 'South') {
        vals.push(
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiString}_time_min10&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiString}_time_min20&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiString}_time_min40&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiString}_time_min60&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiString}_time_min80&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiString}_time_min100&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
        );
        if (veiString !== 'VEI4') {
            vals.push(`https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_S_${veiString}_time_min120&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`);
        }
    } else {
        vals.push(
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min10&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min20&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min40&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min60&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min80&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min100&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
            `https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min120&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`,
        );
        if (veiString !== 'VEI4') {
            vals.push(`https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min140&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`);
            if (veiString !== 'VEI3') {
                vals.push(`https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min160&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`);
                if (veiString !== 'VEI2') {
                    vals.push(`https://riesgos.52north.org/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-0.9180023421741969614,-78.63448207604660922,-0.6413804570762020596,-78.4204016501013399&CRS=EPSG:4326&WIDTH=1233&HEIGHT=1593&LAYERS=LaharArrival_N_${veiString}_time_min180&STYLES=&FORMAT=image/png&DPI=240&MAP_RESOLUTION=240&FORMAT_OPTIONS=dpi:240&TRANSPARENT=TRUE`);
                }
            }
        }
    }

    return vals;
}