import express from 'express';
import axios, { AxiosResponse } from 'axios';
import { Server } from 'http';
import { ScenarioAPIConfig, addScenarioApi } from '../../scenarios/scenario.interface';
import { peruFactory } from './peru';
import { createDirIfNotExists, deleteFile } from '../../utils/files';
import { Datum, DatumReference, ScenarioState } from '../../scenarios/scenarios';
import { sleep } from '../../utils/async';


const port = 1413;
const config: ScenarioAPIConfig = {
    logDir: `./test-data/peru/logs/`,
    storeDir: `./test-data/peru/store/`,
    maxLogAgeMinutes: 60,
    maxStoreLifeTimeMinutes: 60,
    sender: "",
    sendMailTo: [],
    verbosity: 'silent'
}

let server: Server;
beforeAll(async () => {
    await deleteFile(config.logDir);
    await deleteFile(config.storeDir);
    await createDirIfNotExists(config.logDir);
    await createDirIfNotExists(config.storeDir);

    const app = express();
    app.use(express.json());
    const scenarioFactories = [peruFactory];
    
    addScenarioApi(app, scenarioFactories, config);
    server = app.listen(port);
})

afterAll(async () => {
    // await deleteFile(logDir);
    // await deleteFile(storeDir);
    server.close();
});


const parameterDefaultValues: {[key: string]: any} = {
    'eqMmin': '5.0',
    'eqMmax': '9.0',
    'eqZmin': '0',
    'eqZmax': '1000',
    'eqP': '0',
}

function getDefaultDatum(id: string, state: ScenarioState): Datum | DatumReference {
    // @TODO: for some parameters do something more complicated than just a dict-lookup.
    // Example: selected eq.
    return {
        id: id,
        value: parameterDefaultValues[id]
    };
}


describe('Testing peru-scenario', () => {


    test('Testing that all run through', async () => {

        const scenarioInfo: any = await axios.get(`http://localhost:${port}/scenarios/Peru`);
        expect(scenarioInfo).toBeTruthy();

        const steps = scenarioInfo.data.steps;
        expect(steps.length > 0);

        const state: ScenarioState = {
            data: []
        };

        for (const step of steps) {

                for (const input of step.inputs) {
                    const valueFound = state.data.find(d => d.id === input.id);
                    if (!valueFound) {
                        if (input.options && input.options.length > 0) {
                            const optionIndex = Math.floor(Math.random() * input.options.length);
                            const defaultDatum: Datum = {
                                id: input.id,
                                value: input.options[optionIndex]
                            }
                            state.data.push(defaultDatum);
                        } else {
                            const defaultDatum = getDefaultDatum(input.id, state);
                            state.data.push(defaultDatum);
                        }
                    }
                }


                const response = await axios.post(`http://localhost:${port}/scenarios/Peru/steps/${step.id}/execute`, state);
                const ticket = response.data.ticket;

                let poll: AxiosResponse<any>;
                do {
                    await sleep(1000);
                    poll = await axios.get(`http://localhost:${port}/scenarios/Peru/steps/${step.id}/execute/poll/${ticket}`);
                } while (poll.data.ticket);
                const results = poll.data.results;

                expect(results).toBeTruthy();

                for (const datum of results.data) {
                    state.data.push(datum);
                }

        }

    }, 20 * 60 * 1000);  // 20 min timeout

});