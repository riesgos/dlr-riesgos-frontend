import axios from 'axios';
import express, { Express } from 'express';
import session from 'express-session';
declare module 'express-session' {
    export interface SessionData {
      scenarios: Scenario[]
    }
  }
import { addScenarioApi } from './scenario.interface';
import { Data, Scenario } from './scenarios';
import { italyScenarioFactory } from './italyScenario';
import { sleep } from '../utils/async';
import { deleteFile } from '../utils/files';


const http = axios.create({
    withCredentials: true
});
const port = 5001;
const cacheDir = './data/tmp-scenarios/cache';
let app: Express;
let server: Express.Application;
beforeAll(() => {
    deleteFile(cacheDir);
    app = express();
    app.use(express.json());
    app.use(session({
        secret: 'someSecret',
        name: 'scenarios',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        }
    }));
    const scenarios = [italyScenarioFactory];
    addScenarioApi(app, scenarios, cacheDir);
    server = app.listen(port, () => {});
});

afterAll(() => {
    deleteFile(cacheDir);
});



describe('scenarios', () => {

    test('GET scenarios', async () => {
        const response = await http.get(`http://localhost:${port}/scenarios`);
        const data = response.data;
        expect(data).toBeTruthy();
        expect(data.length > 0).toBe(true);
        expect(data[0].id).toBeTruthy();
    });

    test('GET steps', async () => {
        const response = await http.get(`http://localhost:${port}/scenarios`);
        const scenarios = response.data;
        const scenario = scenarios[0];
        const response2 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps`);
        const steps = response2.data;
        expect(steps).toBeTruthy();
        expect(steps.length > 0).toBe(true);
        expect(steps[0].title).toBeTruthy();
        expect(steps[0].state).toBe('incomplete');
    });

    test('POST execute and poll', async () => {
        const response = await http.get(`http://localhost:${port}/scenarios`);
        const scenarios = response.data;
        const scenario = scenarios[0];
        const response2 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps`);
        const steps = response2.data;
        const step = steps[0];
        const inputs = step.inputs;
        const input = inputs[0];
        const inputValues: Data[] = [{
            id: input.id,
            value: input.options[0]
        }];
        // request 1: start execution
        const response3 = await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute`, inputValues);
        const { ticket } = response3.data;
        expect(ticket).toBeTruthy();
        // request 2: first poll ...
        const response4 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute/poll/${ticket}`);
        expect(response4.data.ticket).toBeTruthy();
        await sleep(1000);
        // request 3: second poll.
        const response5 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute/poll/${ticket}`);
        const { results } = response5.data;
        expect(results).toBeTruthy();
        expect(results.length > 0).toBe(true);
        expect(results[0].id).toBeTruthy();
        // expect state to have been updated accordingly
        const response6 = await http.get(`http://localhost:${port}/scenarios/Italy/steps`);
        const stepsUpdated = response6.data;
        expect(stepsUpdated[0].state).toBe('completed');
        expect(stepsUpdated[1].state).toBe('ready');
    });


    test('SESSIONS', async () => {
        const response = await http.get(`http://localhost:${port}/scenarios/Italy/steps`);
        const steps = response.data;
        expect(steps[0].state).toBe('completed');
        expect(steps[1].state).toBe('ready');
        // Now new requests through new client
        const http2 = axios.create({ withCredentials: true });
        const response2 = await http2.get(`http://localhost:${port}/scenarios/Italy/steps`);
        const steps2 = response2.data;
        expect(steps2[0].state).toBe('incomplete');
        expect(steps2[1].state).toBe('incomplete');
    });

});