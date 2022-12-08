import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { addScenarioApi } from '../../../scenarios/scenario.interface';
import { peruFactory } from '../peru';
import { DatumReference, ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';
import { exposureTestData } from '../testdata/exposure';
import { eqSimXmlTestData } from '../testdata/eqSimXml';


const port = 1418;
const logDir = `./test-data/peru-sysrel/logs/`;
const storeDir = `./test-data/peru-sysrel/store/`;  

let server: Server;
beforeAll(async () => {
    await deleteFile(logDir);
    await deleteFile(storeDir);
    await createDirIfNotExists(logDir);
    await createDirIfNotExists(storeDir);

    const app = express();
    const scenarioFactories = [peruFactory];

    addScenarioApi(app, scenarioFactories, storeDir, logDir, 'silent');
    server = app.listen(port, () => console.log(`app listening on port ${port}`));
})

afterAll(async () => {
    server.close();
});


test('Testing sysrel', async () => {
    const stepId = 'SysRel';

    const state: ScenarioState = {
        data: [{
            id: 'eqSimXmlRef',
            value: '', // @TODO: get reference to eqSimXmlTestData
        }]
    };

    const response = await axios.post(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute`, state);
    const ticket = response.data.ticket;

    let poll: any;
    do {
        await sleep(1000);
        console.log('polling ...');
        poll = await axios.get(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute/poll/${ticket}`);
    } while (poll.data.ticket);
    const results = poll.data.results;

    expect(results).toBeTruthy();
    expect(results.data).toBeTruthy();
}, 60000);

