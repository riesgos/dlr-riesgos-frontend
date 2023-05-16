import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { addScenarioApi } from '../../scenarios/scenario.interface';
import { peruShortFactory } from './peru';
import { createDirIfNotExists, deleteFile } from '../../utils/files';


const port = 1413;
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
    const scenarioFactories = [peruShortFactory];
    
    addScenarioApi(app, scenarioFactories, storeDir, storeDir);
    server = app.listen(port);
})

afterAll(async () => {
    // await deleteFile(logDir);
    // await deleteFile(storeDir);
    server.close();
});


describe('Testing peru-scenario', () => {


    test('Testing that all run through', async () => {

        const scenarioInfo: any = await axios.get(`http://localhost:${port}/scenarios/Peru`);
        expect(scenarioInfo).toBeTruthy();

        const steps = scenarioInfo.data.steps;
        expect(steps.length > 0);

        for (const step of steps) {
            // @TODO: execute all processes
        }

    });

});