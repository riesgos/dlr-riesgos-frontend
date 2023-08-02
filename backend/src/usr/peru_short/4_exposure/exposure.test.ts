import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { ScenarioAPIConfig, addScenarioApi } from '../../../scenarios/scenario.interface';
import { peruShortFactory } from '../peru';
import { DatumReference, ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';
import { Bbox, getExposureModel } from '../../wpsServices';


const port = 1416;
const config: ScenarioAPIConfig = {
    logDir: `./test-data/peru-exposure/logs/`,
    storeDir: `./test-data/peru-exposure/store/`,
    sendMailTo: [],
    maxLogAgeMinutes: 60,
    maxStoreLifeTimeMinutes: 60,
    sender: "",
    verbosity: "silent"
};

let server: Server;
beforeAll(async () => {
    await deleteFile(config.logDir);
    await deleteFile(config.storeDir);
    await createDirIfNotExists(config.logDir);
    await createDirIfNotExists(config.storeDir);

    const app = express();
    const scenarioFactories = [peruShortFactory];

    addScenarioApi(app, scenarioFactories, config);
    server = app.listen(port);
})

afterAll(async () => {
    server.close();
});


test('Peru-short: Testing exposure', async () => {
    const stepId = 'Exposure';

    const state: ScenarioState = {
        data: [{
            id: 'exposureModelName',
            value: 'LimaCVT1_PD30_TI70_5000'
        }]
    };
    const response = await axios.post(`http://localhost:${port}/scenarios/PeruShort/steps/${stepId}/execute?skipCache=true`, state);
    const ticket = response.data.ticket;

    let poll: any;
    do {
        await sleep(1000);
        poll = await axios.get(`http://localhost:${port}/scenarios/PeruShort/steps/${stepId}/execute/poll/${ticket}`);
    } while (poll.data.ticket);
    const results = poll.data.results;

    expect(results).toBeTruthy();
    expect(results.data).toBeTruthy();
    expect(results.data.length > 0);

    const result = results.data.find((r: DatumReference) => r.id === 'exposure')
    expect(result.reference);
    
    const fileResponse = await axios.get(`http://localhost:${port}/files/${result.reference}`);
    const data = fileResponse.data;
    expect(data).toBeTruthy();
    expect(data.type).toBe('FeatureCollection');
    expect(data.features[0]);
    expect(data.features[0].id);
    expect(data.features[0].type).toBe('Feature');
    expect(data.features[0].geometry);
    expect(data.features[0].properties);
}, 30000);


test('Peru-short: calling exposure directly', async () => {

    const bbox: Bbox = {
        crs: 'EPSG:4326',
        lllon: -80.8,
        urlon:  -71.4,
        lllat: -20.2,
        urlat: -10.0
    }

    const { exposureModel, exposureRef } = await getExposureModel('LimaCVT1_PD30_TI70_5000', 'SARA_v1.0', bbox);

    expect(exposureModel);
    expect(exposureRef);
});


test('Peru-short: calling exposure even more directly', async () => {

    const url = "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService?service=WPS&request=Execute&version=1.0.0&identifier=org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess"
    const xmlBody = `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" service="WPS" version="1.0.0"><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess</p0:Identifier><wps:DataInputs><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">model</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">model</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>LimaCVT1_PD30_TI70_5000</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">schema</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">schema</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>SARA_v1.0</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">lonmin</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">lonmin</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>-80.8</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">lonmax</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">lonmax</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>-71.4</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">latmin</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">latmin</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>-20.2</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">latmax</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">latmax</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>-10</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">assettype</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">assettype</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>res</wps:LiteralData></wps:Data></wps:Input><wps:Input><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">querymode</p0:Identifier><p0:Title xmlns:p0="http://www.opengis.net/ows/1.1">querymode</p0:Title><p0:Abstract xmlns:p0="http://www.opengis.net/ows/1.1"></p0:Abstract><wps:Data><wps:LiteralData>intersects</wps:LiteralData></wps:Data></wps:Input></wps:DataInputs><wps:ResponseForm><wps:ResponseDocument storeExecuteResponse="true" status="true"><wps:Output mimeType="application/json" asReference="false"><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">selectedRowsGeoJson</p0:Identifier></wps:Output><wps:Output mimeType="application/json" asReference="true"><p0:Identifier xmlns:p0="http://www.opengis.net/ows/1.1">selectedRowsGeoJson</p0:Identifier></wps:Output></wps:ResponseDocument></wps:ResponseForm></wps:Execute>`

    const client = axios;

    const postResponse = await client.post(url, xmlBody, {
        headers: {
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        },
        responseType: 'text',
    });

    expect(postResponse);

    let stateUrl = postResponse.data.match(/statusLocation=\\*"([a-zA-Z0-9:/\-\.?=]*)\\*"/)[1];
    let results: any = undefined;
    while (!results) {

        console.log("Polling ", stateUrl);
        const pollResponse = await client.get(stateUrl, {
            headers: {
                'Accept': 'text/xml, application/xml'
            },
            responseType: 'text'
        });
        stateUrl = pollResponse.data.match(/statusLocation=\\*"([a-zA-Z0-9:/\-\.?=]*)\\*"/)[1];
        if (!stateUrl) results = pollResponse.data;
    }

    expect(results);

});
