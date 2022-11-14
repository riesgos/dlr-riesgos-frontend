import { WpsClient, WpsInput, WpsOutputDescription } from "../../utils/wps/public-api";


const wpsClient1 = new WpsClient('1.0.0');
const wpsClient2 = new WpsClient('2.0.0');


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
        reference: false,
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
        reference: false,
        format: 'application/json'
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return results[0].value[0];
}



export type ExposureModel =  "ValpCVTBayesian" | "ValpCommuna" | "ValpRegularOriginal" | "ValpRegularGrid" | "LimaCVT1_PD30_TI70_5000" | "LimaCVT2_PD30_TI70_10000" | "LimaCVT3_PD30_TI70_50000" | "LimaCVT4_PD40_TI60_5000" | "LimaCVT5_PD40_TI60_10000" | "LimaCVT6_PD40_TI60_50000" | "LimaBlocks" | "LatacungaRuralAreas";


/**
 * Calls Assetmaster
 */
export async function getExposureModel(modelName: ExposureModel, schemaName: Schema) {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService";
    const processId = "org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess";


    // bounding box: covering all study-areas (Chile, Ecuador, Peru)
    const lonmin: WpsInput = {
        description: {
            id: 'lonmin',
            reference: false,
            type: 'literal'
        },
        value: '-88'
    };
    const lonmax: WpsInput = {
        description: {
            id: 'lonmax',
            reference: false,
            type: 'literal'
        },
        value: '-66',
    };
    const latmin: WpsInput = {
        description: {
            id: 'latmin',
            reference: false,
            type: 'literal'
        },
        value: '-21'
    };
    const latmax: WpsInput = {
        description: {
            id: 'latmax',
            reference: false,
            type: 'literal'
        },
        value: '-0'
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
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return results[0].value[0];
}


/**
 * Calls Deus
 */
export async function getDamage(schemaName: Schema, fragility: any, intensityXMLString: any, exposureJson: any) {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService";
    const processId = "org.n52.gfz.riesgos.algorithm.impl.DeusProcess";

    const inputs: WpsInput[] = [{
        description: {
            id: 'intensity',
            reference: false,
            type: 'complex',
            format: 'text/xml'
        },
        value: intensityXMLString
    }, {
        description: {
            id: 'exposure',
            reference: false,
            type: 'complex',
            format: 'application/json'
        },
        value: exposureJson
    }, {
        description: {
            id: 'fragility',
            reference: false,
            type: 'complex',
            format: 'application/json'
        },
        value: fragility
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
    }];

    const results = await wpsClient1.executeAsync(url, processId, inputs, outputs);

    return {
        wms: results.find(r => r.description.id === 'shapefile_summary')?.value[0],
        summary: results.find(r => r.description.id === 'meta_summary')?.value[0]
    };
}