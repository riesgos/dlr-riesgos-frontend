import axios from 'axios';
import express, { Express } from 'express';
import session from 'express-session';
import { addScenarioApi } from './scenario.interface';
import { Data, ScenarioState } from './scenarios';
import { italyScenario } from './italyScenario';
import { sleep } from '../utils/async';
import { deleteFile } from '../utils/files';


const http = axios.create();
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
    const scenarios = [italyScenario];
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
        const response2 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}`);
        const fullScenario = response2.data;
        expect(fullScenario).toBeTruthy();
        expect(fullScenario.steps.length > 0).toBe(true);
        expect(fullScenario.steps[0].title).toBeTruthy();
    });

    test('POST execute and poll', async () => {
        const response = await http.get(`http://localhost:${port}/scenarios`);
        const scenarios = response.data;
        const scenario = scenarios[0];
        const response2 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}`);
        const fullScenario = response2.data;
        const step = fullScenario.steps[0];
        const inputs = step.inputs;
        const input = inputs[0];
        const state: ScenarioState = {
            data: [{
                id: input.id,
                value: input.options[0]
            }]
        };
        // request 1: start execution
        const response3 = await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute`, state);
        const { ticket } = response3.data;
        expect(ticket).toBeTruthy();
        // request 2: first poll ...
        const response4 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute/poll/${ticket}`);
        expect(response4.data.ticket).toBeTruthy();
        await sleep(1000);
        // request 3: second poll.
        const response5 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute/poll/${ticket}`);
        const { results: newState } = response5.data;
        expect(newState).toBeTruthy();
        expect(newState.data.length > 0).toBe(true);
        expect(newState.data[0].id).toBeTruthy();
    });


    test('POST 2nd step', async () => {
        const response = await http.get(`http://localhost:${port}/scenarios`);
        const scenarios = response.data;
        const scenario = scenarios[0];
        const response2 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}`);
        const fullScenario = response2.data;
        const step = fullScenario.steps[0];
        const step2 = fullScenario.steps[1];
        const inputs = step.inputs;
        const input = inputs[0];
        const state: ScenarioState = {
            data: [{
                id: input.id,
                // using another input value this time to bust cache
                value: input.options[1]
            }]
        };
        const response3 = await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute`, state);
        const { ticket } = response3.data;
        await sleep(1000);
        const response4 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.step}/execute/poll/${ticket}`);
        const { results: newState } = response4.data;
        const response5 = await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step2.step}/execute`, newState);
        const { ticket: newTicket } = response5.data;
        expect(newTicket).toBeTruthy();
        await sleep(1000);
        const response6 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step2.step}/execute/poll/${newTicket}`);
        const { results: finalState } = response6.data; console.log('final response', response6.data)
        expect(finalState).toBeTruthy();
        expect(finalState.data.length > 1).toBe(true);
        expect(finalState.data[1].id).toBeTruthy();
    });

});