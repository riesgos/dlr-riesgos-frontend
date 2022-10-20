import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { addScenarioApi } from '../../../scenarios/scenario.interface';
import { peruFactory } from '../peru';
import { ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';


const port = 1412;
const logDir = `./test-data/peru/logs/`; // server-logs
const storeDir = `./test-data/peru/store/`;

let server: Server;
beforeAll(async () => {
    await deleteFile(logDir);
    await deleteFile(storeDir);
    await createDirIfNotExists(logDir);
    await createDirIfNotExists(storeDir);

    const app = express();
    app.use(express.json());
    const scenarioFactories = [peruFactory];

    addScenarioApi(app, scenarioFactories, storeDir, storeDir);
    server = app.listen(port);
})

afterAll(async () => {
    server.close();
});


test('Testing eq-catalog', async () => {
    const stepId = 'Eqs';

    const state: ScenarioState = {
        data: []
    };

    const response = await axios.post(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute`, state);
    const ticket = response.data.ticket;

    let poll: any;
    do {
        await sleep(100);
        poll = await axios.get(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute/poll/${ticket}`);
    } while (poll.data.ticket);
    const results = poll.data.results;

    expect(results).toBeTruthy();
    expect(results.data).toBeTruthy();
    expect(results.data.length > 0);
    expect(results.data[0].id).toBe('availableEqs');
    expect(results.data[0].reference);

    const fileResponse = await axios.get(`http://localhost:${port}/files/${results.data[0].reference}`);
    const data = fileResponse.data;
    expect(data).toBeTruthy();
});

