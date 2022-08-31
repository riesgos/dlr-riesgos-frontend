import axios from 'axios';
import { addScenarioApi } from './scenario.interface';
import express, { Express } from 'express';
import { Data } from './scenarios';
import { sleep } from '../utils/async';
import { italyScenario } from './italyScenario';
import { deleteFile } from '../utils/files';

const port = 5001;
const cacheDir = './data/tmp-scenarios/cache';
let app: Express;
let server: Express.Application;
beforeAll(() => {
    deleteFile(cacheDir);
    app = express();
    app.use(express.json());
    const scenarios = [italyScenario];
    addScenarioApi(app, scenarios, cacheDir);
    server = app.listen(port, () => {});
});

afterAll(() => {
    deleteFile(cacheDir);
});



describe('scenarios', () => {

    test('GET scenarios', async () => {
        const response = await axios.get(`http://localhost:${port}/scenarios`);
        const data = response.data;
        expect(data).toBeTruthy();
        expect(data.length > 0).toBe(true);
        expect(data[0].id).toBeTruthy();
    });

    test('GET steps', async () => {
        const response = await axios.get(`http://localhost:${port}/scenarios`);
        const scenarios = response.data;
        const scenario = scenarios[0];
        const response2 = await axios.get(`http://localhost:${port}/scenarios/${scenario.id}/steps`);
        const steps = response2.data;
        expect(steps).toBeTruthy();
        expect(steps.length > 0).toBe(true);
        expect(steps[0].title).toBeTruthy();
        expect(steps[0].state).toBe('incomplete');
    });

    test('POST execute and poll', async () => {
        const response = await axios.get(`http://localhost:${port}/scenarios`);
        const scenarios = response.data;
        const scenario = scenarios[0];
        const response2 = await axios.get(`http://localhost:${port}/scenarios/${scenario.id}/steps`);
        const steps = response2.data;
        const step = steps[0];
        const inputs = step.inputs;
        const input = inputs[0];
        const inputValues: Data[] = [{
            id: input.id,
            value: input.options[0]
        }];
        // request 1: start execution
        const response3 = await axios.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute`, inputValues);
        const { ticket } = response3.data;
        expect(ticket).toBeTruthy();
        // request 2: first poll ...
        const response4 = await axios.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute/poll/${ticket}`);
        expect(response4.data.ticket).toBeTruthy();
        await sleep(1000);
        // request 3: second poll.
        const response5 = await axios.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute/poll/${ticket}`);
        const { results } = response5.data;
        expect(results).toBeTruthy();
        expect(results.length > 0).toBe(true);
        expect(results[0].id).toBeTruthy();
    });


    test('SESSIONS', async () => {



    });

});