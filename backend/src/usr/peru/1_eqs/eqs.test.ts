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
    const scenarioFactories = [peruFactory];

    addScenarioApi(app, scenarioFactories, storeDir, logDir, 'silent', false);
    server = app.listen(port);
})

afterAll(async () => {
    server.close();
});


test('Testing eq-catalog', async () => {
    const stepId = 'Eqs';

    const state: ScenarioState = {
        data: [
            {id: 'eqCatalogType', value: 'observed' },
            { id: 'eqMmin', value: '6.0' },
            { id: 'eqMmax', value: '9.5' },
            { id: 'eqZmin', value: '0' },
            { id: 'eqZmax', value: '100' },
            { id: 'eqP', value: '0.0' }
        ]
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
    const avEqs = results.data.find((d: any) => d.id === 'availableEqs');
    expect(avEqs.reference);

    const fileResponse = await axios.get(`http://localhost:${port}/files/${avEqs.reference}`);
    const data = fileResponse.data;
    expect(data).toBeTruthy();
});

