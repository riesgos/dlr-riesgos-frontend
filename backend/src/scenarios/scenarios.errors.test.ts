import axios from 'axios';
import { Server } from 'http';
import express, { Express } from 'express';
import { addScenarioApi } from './scenario.interface';
import { Datum, ScenarioFactory, ScenarioState } from './scenarios';
import { sleep } from '../utils/async';
import { deleteFile } from '../utils/files';
import { WpsClient } from '../utils/wps/public-api';


// jest.mock('axios');
const wpsClient2 = new WpsClient('2.0.0');

// monkey-patching axios-webclient
// to hijack requests
// so they can be redirected to our fake server
// @ts-ignore
const webClient: any = wpsClient2.webClient
let i = 0;
webClient.post = async function(url: string, xmlBody: string, headers: any, responseType: string) {
    await sleep(100);
    if (i === 0) {
        i += 1;
        return {
            data: `<?xml version="1.0" encoding="UTF-8"?>
            <wps:StatusInfo xmlns:wps="http://www.opengis.net/wps/2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wps/2.0 http://schemas.opengis.net/wps/2.0/wps.xsd">
                <wps:JobID>0b176c77-a902-4035-b56b-83abf3a548e0</wps:JobID>
                <wps:Status>Accepted</wps:Status>
            </wps:StatusInfo>`
        }
    } else {
        throw Error("Network error");
    }
};
webClient.get = async function(url: string, headers: any, responseType: string) {
    await sleep(100);
    throw Error("Network error");
};





const fakeScenarioFactory = new ScenarioFactory('FakeScenario', 'An example scenario');

fakeScenarioFactory.registerStep({
    id: 'WpsService',
    title: 'Service which uses utils/wpd',
    description: '',
    inputs: [],
    outputs: [{
        id: 'wpsResults'
    }],
    function: async function (args: Datum[]) {
        const result = await wpsClient2.executeAsync('url', 'processId', [], [{id: 'outputId', reference: true, type: 'complex'}])
        return [{
            id: 'wpsResults',
            value: result
        }]
    }
})


const sendMailOnError = true;
const http = axios.create();
const port = 5001;
const logDir = './test-data/scenario-errors/logs';
const storeDir = './test-data/scenario-errors/store';
let app: Express;
let server: Server;
beforeAll(async () => {
    await deleteFile(storeDir);
    await deleteFile(logDir);
    app = express();
    app.use(express.json());
    const scenarioFactories = [fakeScenarioFactory];
    addScenarioApi(app, scenarioFactories, storeDir, logDir, 'silent', sendMailOnError);
    server = app.listen(port, () => {});
});

afterAll(async () => {
    await deleteFile(storeDir);
    server.close();
});


describe('Scenarios - test error handling', () => {

    test(`Ensure that 400 error in WPS is passed down to user`, async () => {
        // axios.post.mockImplementation()

      // request 1: start execution
        const state: ScenarioState = { data: [] };
        const response3 = await http.post(`http://localhost:${port}/scenarios/FakeScenario/steps/WpsService/execute`, state);
        const { ticket } = response3.data;
        expect(ticket).toBeTruthy();

        // request 2: first poll ...
        const response4 = await http.get(`http://localhost:${port}/scenarios/FakeScenario/steps/WpsService/execute/poll/${ticket}`);
        expect(response4.data.ticket).toBeTruthy();

        // give time to send request, which will fail ...
        await sleep(3000);

        // request 3: second poll.
        const response5 = await http.get(`http://localhost:${port}/scenarios/FakeScenario/steps/WpsService/execute/poll/${ticket}`);
        const { error } = response5.data;
        expect(error).toBeTruthy();

    }, 15_000);
});
