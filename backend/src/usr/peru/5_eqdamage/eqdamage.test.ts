import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { addScenarioApi } from '../../../scenarios/scenario.interface';
import { peruFactory } from '../peru';
import { DatumReference, ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';
import { exposureTestData } from '../testdata/exposure';
import { eqSimXmlTestData } from '../testdata/eqSimXml';


const port = 1417;
const logDir = `./test-data/peru-eqdmg/logs/`;
const storeDir = `./test-data/peru-eqdmg/store/`;  

let server: Server;
beforeAll(async () => {
    await deleteFile(logDir);
    await deleteFile(storeDir);
    await createDirIfNotExists(logDir);
    await createDirIfNotExists(storeDir);

    const app = express();
    const scenarioFactories = [peruFactory];

    addScenarioApi(app, scenarioFactories, storeDir, logDir, 'silent');
    server = app.listen(port, () => console.log(`app listening on port ${port}`));
})

afterAll(async () => {
    server.close();
});


test('Testing eq-damage', async () => {
    const stepId = 'EqDamage';

    const state: ScenarioState = {
        data: [{
            id: 'exposure',
            // only wants the `value` part of modelprop's output
            value: exposureTestData.value[0]  
        }, {
            id: 'eqSimXml',
            value: eqSimXmlTestData
        }]
    };

    const response = await axios.post(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute`, state);
    const ticket = response.data.ticket;

    let poll: any;
    do {
        await sleep(1000);
        console.log('polling ...');
        poll = await axios.get(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute/poll/${ticket}`);
    } while (poll.data.ticket);
    const results = poll.data.results;

    expect(results).toBeTruthy();
    expect(results.data).toBeTruthy();

    const wmsResult = results.data.find((r: DatumReference) => r.id === 'eqDamageWms');
    expect(wmsResult.reference);
    
    const wmsFile = await axios.get(`http://localhost:${port}/files/${wmsResult.reference}`);
    const wmsData: string = wmsFile.data;
    expect(wmsData.includes("wms"));


    const summaryResult = results.data.find((r: DatumReference) => r.id === 'eqDamageSummary');
    expect(summaryResult.reference);
    
    const summaryFile = await axios.get(`http://localhost:${port}/files/${summaryResult.reference}`);
    const summaryData = summaryFile.data;
    expect(summaryData.custom_columns);
    expect(summaryData.cum_loss_unit);
    expect(summaryData.loss_unit);
    expect(summaryData.total);
}, 60000);

