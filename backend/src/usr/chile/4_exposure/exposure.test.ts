import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { addScenarioApi } from '../../../scenarios/scenario.interface';
import { chileFactory } from '../chile';
import { DatumReference, ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';


const port = 1416;
const logDir = `./test-data/peru-exposure/logs/`;
const storeDir = `./test-data/peru-exposure/store/`;  

let server: Server;
beforeAll(async () => {
    await deleteFile(logDir);
    await deleteFile(storeDir);
    await createDirIfNotExists(logDir);
    await createDirIfNotExists(storeDir);

    const app = express();
    const scenarioFactories = [chileFactory];

    addScenarioApi(app, scenarioFactories, storeDir, logDir, 'silent');
    server = app.listen(port);
})

afterAll(async () => {
    server.close();
});


test('Testing eq-simulation', async () => {
    const stepId = 'Exposure';

    const state: ScenarioState = {
        data: [{
            id: 'exposureModelName',
            value: 'LimaCVT1_PD30_TI70_5000'
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

