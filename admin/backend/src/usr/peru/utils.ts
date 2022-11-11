import { WpsClient, WpsInput, WpsOutputDescription } from "../../utils/wps/public-api";


const wpsClient = new WpsClient('1.0.0');


export type Vsgrid = 'USGSSlopeBasedTopographyProxy' | 'FromSeismogeotechnicsMicrozonation';
export type Gmpe = 'MontalvaEtAl2016SInter' | 'GhofraniAtkinson2014' | 'AbrahamsonEtAl2015SInter' | 'YoungsEtAl1997SInterNSHMP2008';

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
        format: 'application/vnd.geo+json'
    }];

    const results = await wpsClient.executeAsync(url, processId, wpsInputs, wpsOutputs);

    return results[0].value[0];
}





export type Schema = "SARA_v1.0" |"HAZUS_v1.0" |"SUPPASRI2013_v2.0" |"Mavrouli_et_al_2014" |"Torres_Corredor_et_al_2017" |"Medina_2019";

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
    }];

    const outputs: WpsOutputDescription[] = [{
        id: 'selectedRows',
        type: 'complex',
        reference: false,
        format: 'application/json'
    }];

    const results = await wpsClient.executeAsync(url, processId, inputs, outputs);

    return results[0];
}



export type ExposureModel =  "ValpCVTBayesian" | "ValpCommuna" | "ValpRegularOriginal" | "ValpRegularGrid" | "LimaCVT1_PD30_TI70_5000" | "LimaCVT2_PD30_TI70_10000" | "LimaCVT3_PD30_TI70_50000" | "LimaCVT4_PD40_TI60_5000" | "LimaCVT5_PD40_TI60_10000" | "LimaCVT6_PD40_TI60_50000" | "LimaBlocks" | "LatacungaRuralAreas";

export async function getExposureModel(modelName: ExposureModel) {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService";
    const processId = "org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess";

    const inputs: WpsInput[] = [{
        description: {
            id: 'model',
            reference: false,
            type: 'literal'
        },
        value: modelName
    }];

    const outputs: WpsOutputDescription[] = [{
        id: 'selectedRowsGeoJson',
        type: 'complex',
        reference: false,
        format: 'application/json'
    }];

    const results = await wpsClient.executeAsync(url, processId, inputs, outputs);

    return results[0];
}

export async function getDamage(schemaName: Schema, fragility: any, intensity: any, exposureModel: any) {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService";
    const processId = "org.n52.gfz.riesgos.algorithm.impl.DeusProcess";

    const inputs: WpsInput[] = [{
        description: {
            id: 'intensity',
            reference: false,
            type: 'complex'
        },
        value: intensity
    }, {
        description: {
            id: 'exposure',
            reference: false,
            type: 'complex'
        },
        value: exposureModel
    }, {
        description: {
            id: 'fragility',
            reference: false,
            type: 'complex',
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

    const results = await wpsClient.executeAsync(url, processId, inputs, outputs);

    return results[0];
}