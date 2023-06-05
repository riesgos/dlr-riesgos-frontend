import express from 'express';
import { Server } from 'http';
import { ScenarioAPIConfig, addScenarioApi } from '../../../scenarios/scenario.interface';
import { peruShortFactory } from '../peru';
import { DatumReference, ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';
import { selectedEqTestData } from '../testdata/selectedEq';


const port = 1415;
const config: ScenarioAPIConfig = {
    logDir: `./test-data/peru-eqsim/logs/`,
    storeDir: `./test-data/peru-eqsim/store/`,
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
    const scenarioFactories = [peruShortFactory];

    addScenarioApi(app, scenarioFactories, config);
    server = app.listen(port);
})

afterAll(async () => {
    server.close();
});


test('Testing eq-simulation', async () => {
    const stepId = 'EqSimulation';

    const state: ScenarioState = {
        data: [{
            id: 'selectedEq',
            value: selectedEqTestData
        }, {
            id: 'gmpe',
            value: 'MontalvaEtAl2016SInter'
        }, {
            id: 'vsgrid',
            value: 'USGSSlopeBasedTopographyProxy'
        }]
    };

    const response = await fetch(`http://localhost:${port}/scenarios/PeruShort/steps/${stepId}/execute`, {
        body: JSON.stringify(state),
        method: 'POST'
    });
    const ticket = (await response.json()).ticket;

    let poll: any;
    do {
        await sleep(1000);
        poll = await fetch(`http://localhost:${port}/scenarios/PeruShort/steps/${stepId}/execute/poll/${ticket}`);
    } while (poll.data.ticket);
    const results = (await poll.json()).results;

    expect(results).toBeTruthy();
    expect(results.data).toBeTruthy();
    expect(results.data.length > 0);

    const wmsResult = results.data.find((r: DatumReference) => r.id === 'eqSimWms')
    expect(wmsResult.reference);
    
    const wmsFile = await fetch(`http://localhost:${port}/files/${wmsResult.reference}`);
    const wmsData = await wmsFile.text();
    expect(wmsData).toBeTruthy();

    const xmlResult = results.data.find((r: DatumReference) => r.id === 'eqSimXml');
    expect(xmlResult.reference);
    
    const xmlFile = await fetch(`http://localhost:${port}/files/${xmlResult.reference}`);
    const xmlData = await xmlFile.text();
    expect(xmlData).toBeTruthy();

}, 300000);
