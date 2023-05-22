import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { ScenarioAPIConfig, addScenarioApi } from '../../scenarios/scenario.interface';
import { peruShortFactory } from './peru';
import { createDirIfNotExists, deleteFile } from '../../utils/files';


const port = 1413;
const config: ScenarioAPIConfig = {
    logDir: `./test-data/peru/logs/`,
    storeDir: `./test-data/peru/store/`,
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
    app.use(express.json());
    const scenarioFactories = [peruShortFactory];
    
    addScenarioApi(app, scenarioFactories, config);
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