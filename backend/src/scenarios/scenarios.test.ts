import axios from 'axios';
import { Server } from 'http';
import express, { Express } from 'express';
import { addScenarioApi } from './scenario.interface';
import { Scenario, ScenarioDescription, ScenarioState } from './scenarios';
import { italyScenarioFactory } from './italyScenario';
import { sleep } from '../utils/async';
import { deleteFile } from '../utils/files';


const http = axios.create();
const port = 5001;
const logDir = './test-data/scenarios/logs';
const storeDir = './test-data/scenarios/store';
let app: Express;
let server: Server;
beforeAll(async () => {
    await deleteFile(storeDir);
    app = express();
    app.use(express.json());
    const scenarioFactories = [italyScenarioFactory];
    addScenarioApi(app, scenarioFactories, storeDir, logDir, 'silent');
    server = app.listen(port, () => {});
});

afterAll(async () => {
    await deleteFile(storeDir);
    server.close();
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
        const response3 = await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute`, state);
        const { ticket } = response3.data;
        expect(ticket).toBeTruthy();
        // request 2: first poll ...
        const response4 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`);
        expect(response4.data.ticket).toBeTruthy();
        await sleep(1000);
        // request 3: second poll.
        const response5 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`);
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
        const response3 = await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute`, state);
        const { ticket } = response3.data;
        await sleep(1000);
        const response4 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`);
        const { results: newState } = response4.data;
        const response5 = await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step2.id}/execute`, newState);
        const { ticket: newTicket } = response5.data;
        expect(newTicket).toBeTruthy();
        await sleep(1000);
        const response6 = await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step2.id}/execute/poll/${newTicket}`);
        const { results: finalState } = response6.data;
        expect(finalState).toBeTruthy();
        expect(finalState.data.length > 1).toBe(true);
        expect(finalState.data[1].id).toBeTruthy();
    });

});


describe('scenarios - cache', () => {

    let scenario: ScenarioDescription;
    let state: ScenarioState;
    let firstExecuteResult: any;
    beforeAll(async () => {
        await deleteFile(storeDir);

        scenario = (await http.get(`http://localhost:${port}/scenarios/Italy`)).data;
        const step = scenario.steps[0];
        const inputs = step.inputs;
        const input = inputs[0];
        state = {
            data: [{
                id: input.id,
                value: input.options![0]
            }]
        };

        // request 1: start execution
        const { ticket } = (await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute`, state)).data;
        await sleep(1000);
        // request 2: polling
        const { results } = (await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`)).data;
        firstExecuteResult = results;
    })


    test('cache works', async () => {
        // request 3: repeating same request
        const firstStep = scenario.steps[0];
        const { ticket } = (await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute`, state)).data;
        await sleep(3);
        const cachedResponse = (await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute/poll/${ticket}`)).data;
        expect(cachedResponse.results).toBeTruthy();
        expect(cachedResponse.results).toEqual(firstExecuteResult);
    });


    test('cache doesnt give false positives', async () => {
        const firstStep = scenario.steps[0];
        const firstInput = firstStep.inputs[0];
        const newState: ScenarioState = {
            data: [{
                id: firstInput.id,
                value: firstInput.options![1]  // another value than on first request
            }]
        };

        const { ticket } = (await http.post(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute`, newState)).data;
        await sleep(3);
        const response = (await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute/poll/${ticket}`)).data;

        // This was a new request, so there cannot be a result yet.
        expect(response.ticket).toBeTruthy();
        expect(response.results).toBeFalsy();

        await sleep(1000);
        const { results } = (await http.get(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute/poll/${ticket}`)).data;
        expect(results).toBeTruthy();
        expect(results !== firstExecuteResult);
    });

    test('cache expires', async () => {

    });
});


describe('scenarios - in/out', () => {

    test('value-product in becomes value-product out', async () => {});

    test('reference-product in becomes reference-product out', async () => {});

    test('executing two jobs side-by-side.', async () => {});
});