import { Server } from 'http';
import express, { Express } from 'express';
import { ScenarioAPIConfig, addScenarioApi } from './scenario.interface';
import { ScenarioDescription, ScenarioState } from './scenarios';
import { sleep } from '../utils/async';
import { deleteFile } from '../utils/files';
import { italyScenarioFactory } from '../usr/italy/italyScenario';


const port = 5001;

const config: ScenarioAPIConfig = {
    logDir: './test-data/scenarios/logs',
    storeDir: './test-data/scenarios/store',
    verbosity: 'silent',
    sendMailTo: [],
    sender: "",
    maxLogAgeMinutes: 60,
    maxStoreLifeTimeMinutes: 60
}

let app: Express;
let server: Server;
beforeAll(async () => {
    await deleteFile(config.storeDir);
    await deleteFile(config.logDir);
    app = express();
    app.use(express.json());
    const scenarioFactories = [italyScenarioFactory];
    addScenarioApi(app, scenarioFactories, config);
    server = app.listen(port, () => {});
});

afterAll(async () => {
    await deleteFile(config.storeDir);
    server.close();
});



describe('scenarios', () => {

    test('GET scenarios', async () => {
        const data = await (await fetch(`http://localhost:${port}/scenarios`)).json();
        expect(data).toBeTruthy();
        expect(data.length > 0).toBe(true);
        expect(data[0].id).toBeTruthy();
    });

    test('GET steps', async () => {
        const response = await fetch(`http://localhost:${port}/scenarios`);
        const scenarios = await response.json();
        const scenario = scenarios[0];
        const response2 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}`);
        const fullScenario = await response2.json();
        expect(fullScenario).toBeTruthy();
        expect(fullScenario.steps.length > 0).toBe(true);
        expect(fullScenario.steps[0].title).toBeTruthy();
    });

    test('POST execute and poll', async () => {
        const response = await fetch(`http://localhost:${port}/scenarios`);
        const scenarios = await response.json();
        const scenario = scenarios[0];
        const response2 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}`);
        const fullScenario = await response2.json();
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
        const response3 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute`, { body: JSON.stringify(state), method: 'POST' });
        const { ticket } = await response3.json();
        expect(ticket).toBeTruthy();
        // request 2: first poll ...
        const response4 = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`)).json();
        expect(response4.ticket).toBeTruthy();
        await sleep(1000);
        // request 3: second poll.
        const response5 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`);
        const { results: newState } = await response5.json();
        expect(newState).toBeTruthy();
        expect(newState.data.length > 0).toBe(true);
        expect(newState.data[0].id).toBeTruthy();
    });


    test('POST 2nd step', async () => {
        const response = await fetch(`http://localhost:${port}/scenarios`);
        const scenarios = await response.json();
        const scenario = scenarios[0];
        const response2 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}`);
        const fullScenario = await response2.json();
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
        const response3 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute`, { body: JSON.stringify(state), method: 'POST' });
        const { ticket } = await response3.json();
        await sleep(1000);
        const response4 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`);
        const { results: newState } = await response4.json();
        const response5 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step2.id}/execute`, { body: JSON.stringify(newState), method: 'POST' });
        const { ticket: newTicket } = await response5.json();
        expect(newTicket).toBeTruthy();
        await sleep(1000);
        const response6 = await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step2.id}/execute/poll/${newTicket}`);
        const { results: finalState } = await response6.json();
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
        await deleteFile(config.storeDir);

        scenario = await (await fetch(`http://localhost:${port}/scenarios/Italy`)).json();
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
        const { ticket } = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute`, { body: JSON.stringify(state), method: 'POST' })).json();
        await sleep(1000);
        // request 2: polling
        const { results } = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step.id}/execute/poll/${ticket}`)).json();
        firstExecuteResult = results;
    })


    test('cache works', async () => {
        // request 3: repeating same request
        const firstStep = scenario.steps[0];
        const { ticket } = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute`, { body: JSON.stringify(state), method: 'POST' })).json();
        await sleep(3);
        const cachedResponse = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute/poll/${ticket}`)).json();
        expect(cachedResponse.results).toBeTruthy();
        expect(cachedResponse.results).toEqual(firstExecuteResult);
    });


    test('cache doesnt give false positives', async () => {
        const firstStep = scenario.steps[0];
        const firstInput = firstStep.inputs[0];
        const newState: ScenarioState = {
            data: [{
                id: firstInput.id,
                value: firstInput.options![2]  // another value than on first request
            }]
        };

        const { ticket } = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute`, { body: JSON.stringify(newState), method: 'POST' })).json();
        await sleep(3);
        const response = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute/poll/${ticket}`)).json();

        // This was a new request, so there cannot be a result yet.
        expect(response.ticket).toBeTruthy();
        expect(response.results).toBeFalsy();

        await sleep(1000);
        const { results } = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${firstStep.id}/execute/poll/${ticket}`)).json();
        expect(results).toBeTruthy();
        expect(results !== firstExecuteResult);
    });

    test('cache expires', async () => {

    });
});


describe('scenarios - in/out', () => {

    beforeAll(async () => {
        await deleteFile(config.storeDir);
        await deleteFile(config.logDir);
    })


    test('value-product in becomes value-product out', async () => {});

    test('reference-product in becomes reference-product out', async () => {});

    test('executing two jobs side-by-side.', async () => {

        const scenario: ScenarioDescription = await (await fetch(`http://localhost:${port}/scenarios/Italy`)).json();
        const step1 = scenario.steps.find(s => s.id === 'EqSim')!;
        const inputs = step1.inputs;
        const input = inputs[0];
        const state = {
            data: [{
                id: input.id,
                value: input.options![0]
            }]
        };

        let response = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step1.id}/execute`, { body: JSON.stringify(state), method: 'POST' })).json();
        while (response.ticket) {
            await sleep(100);
            console.log("sleeping ...")
            response = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step1.id}/execute/poll/${response.ticket}`)).json();
        }
        const newState = response.results;
        expect(newState).toBeTruthy();

        const step2 = scenario.steps.find(s => s.id === 'EqDmg')!;
        const step3 = scenario.steps.find(s => s.id === 'EqStats')!;

        const result2 = await( await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step2.id}/execute`, { body: JSON.stringify(newState), method: 'POST' })).json();
        const result3 = await( await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step3.id}/execute`, { body: JSON.stringify(newState), method: 'POST' })).json();

        expect(result2.ticket).toBeTruthy();
        expect(result3.ticket).toBeTruthy();
        
        const ticket2 = result2.ticket;
        const ticket3 = result3.ticket;
        expect(ticket2 !== ticket3).toBeTruthy();


        await sleep(500);

        const response2 = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step2.id}/execute/poll/${ticket2}`)).json();
        const response3 = await (await fetch(`http://localhost:${port}/scenarios/${scenario.id}/steps/${step3.id}/execute/poll/${ticket3}`)).json();

        expect(response2.results).toBeTruthy();
        expect(response3.results).toBeTruthy();
    }, 10_000);
});