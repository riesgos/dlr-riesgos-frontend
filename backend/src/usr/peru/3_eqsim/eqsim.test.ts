import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { addScenarioApi } from '../../../scenarios/scenario.interface';
import { peruFactory } from '../peru';
import { DatumReference, ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';
import { selectedEqTestData } from '../testdata/selectedEq';


const port = 1415;
const logDir = `./test-data/peru-eqsim/logs/`;
const storeDir = `./test-data/peru-eqsim/store/`;  

let server: Server;
beforeAll(async () => {
    await deleteFile(logDir);
    await deleteFile(storeDir);
    await createDirIfNotExists(logDir);
    await createDirIfNotExists(storeDir);

    const app = express();
    const scenarioFactories = [peruFactory];

    addScenarioApi(app, scenarioFactories, storeDir, logDir, 'silent');
    server = app.listen(port);
})

afterAll(async () => {
    server.close();
});


test('Testing eq-simulation', async () => {
    const stepId = 'EqSimulation';

    const state: ScenarioState = {
        data: [{
            id: 'selectedEq',
            value: selectedEqTestData
        }, {
            id: 'gmpe',
            value: 'MontalvaEtAl2016SInter'
        }, {
            id: 'vsgrid',
            value: 'USGSSlopeBasedTopographyProxy'
        }]
    };

    const response = await axios.post(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute`, state);
    const ticket = response.data.ticket;

    let poll: any;
    do {
        await sleep(1000);
        poll = await axios.get(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute/poll/${ticket}`);
    } while (poll.data.ticket);
    const results = poll.data.results;

    expect(results).toBeTruthy();
    expect(results.data).toBeTruthy();
    expect(results.data.length > 0);

    const wmsResult = results.data.find((r: DatumReference) => r.id === 'eqSimWms')
    expect(wmsResult.reference);
    
    const wmsFile = await axios.get(`http://localhost:${port}/files/${wmsResult.reference}`);
    const wmsData = wmsFile.data;
    expect(wmsData).toBeTruthy();

    const xmlResult = results.data.find((r: DatumReference) => r.id === 'eqSimXml');
    expect(xmlResult.reference);
    
    const xmlFile = await axios.get(`http://localhost:${port}/files/${xmlResult.reference}`);
    const xmlData = xmlFile.data;
    expect(xmlData).toBeTruthy();

}, 300000);
