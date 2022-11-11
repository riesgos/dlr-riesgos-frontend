import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { addScenarioApi } from '../../../scenarios/scenario.interface';
import { peruFactory } from '../peru';
import { DatumReference, ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';


const port = 1415;
const logDir = `./test-data/peru-eqsim/logs/`; // server-logs
const storeDir = `./test-data/peru-eqsim/store/`;  

let server: Server;
beforeAll(async () => {
    await deleteFile(logDir);
    await deleteFile(storeDir);
    await createDirIfNotExists(logDir);
    await createDirIfNotExists(storeDir);

    const app = express();
    app.use(express.json());
    const scenarioFactories = [peruFactory];

    addScenarioApi(app, scenarioFactories, storeDir, logDir);
    server = app.listen(port);
})

afterAll(async () => {
    server.close();
});


test('Testing eq-simulation', async () => {
    const stepId = 'EqSim';

    const state: ScenarioState = {
        data: [{
            id: 'selectedEq',
            value: {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -77.9318,
                        -12.1908
                    ]
                },
                "properties": {
                    "publicID": "quakeml:quakeledger/peru_70000011",
                    "preferredOriginID": "quakeml:quakeledger/peru_70000011",
                    "preferredMagnitudeID": "quakeml:quakeledger/peru_70000011",
                    "type": "earthquake",
                    "description.text": "observed",
                    "origin.publicID": "quakeml:quakeledger/peru_70000011",
                    "origin.time.value": "1746-10-28T00:00:00.000000Z",
                    "origin.depth.value": "8.0",
                    "origin.creationInfo.value": "GFZ",
                    "magnitude.publicID": "quakeml:quakeledger/peru_70000011",
                    "magnitude.mag.value": "9.0",
                    "magnitude.type": "MW",
                    "magnitude.creationInfo.value": "GFZ",
                    "focalMechanism.publicID": "quakeml:quakeledger/peru_70000011",
                    "focalMechanism.nodalPlanes.nodalPlane1.strike.value": "329.0",
                    "focalMechanism.nodalPlanes.nodalPlane1.dip.value": "20.0",
                    "focalMechanism.nodalPlanes.nodalPlane1.rake.value": "90.0",
                    "focalMechanism.nodalPlanes.preferredPlane": "nodalPlane1"
                },
                "id": "quakeml:quakeledger/peru_70000011"
            }
        }, {
            id: 'gmpe',
            value: 'MontalvaEtAl2016SInter'
        }, {
            id: 'vsgrid',
            value: 'USGSSlopeBasedTopographyProxy'
        }]
    };

    const response = await axios.post(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute`, state);
    const ticket = response.data.ticket;

    let poll: any;
    do {
        await sleep(1000);
        poll = await axios.get(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute/poll/${ticket}`);
    } while (poll.data.ticket);
    const results = poll.data.results;

    expect(results).toBeTruthy();
    expect(results.data).toBeTruthy();
    expect(results.data.length === 4);

    const result = results.data.find((r: DatumReference) => r.id === 'eqSim')
    expect(result.id).toBe('eqSim');
    expect(result.reference);
    
    const fileResponse = await axios.get(`http://localhost:${port}/files/${result.reference}`);
    const data = fileResponse.data;
    expect(data).toBeTruthy();
    expect(data.type).toBe('FeatureCollection');
    expect(data.features[0]);
    expect(data.features[0].id);
    expect(data.features[0].type).toBe('Feature');
    expect(data.features[0].geometry);
    expect(data.features[0].properties);
}, 30000);

