import express from 'express';
import axios from 'axios';
import { Server } from 'http';
import { ScenarioAPIConfig, addScenarioApi } from '../../../scenarios/scenario.interface';
import { peruFactory } from '../peru';
import { DatumReference, ScenarioState } from '../../../scenarios/scenarios';
import { sleep } from '../../../utils/async';
import { createDirIfNotExists, deleteFile } from '../../../utils/files';


const port = 1414;
const config: ScenarioAPIConfig = {
    logDir: `./test-data/peru-eqselect/logs/`,
    storeDir: `./test-data/peru-eqselect/store/`,
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
    const scenarioFactories = [peruFactory];

    addScenarioApi(app, scenarioFactories, config);
    server = app.listen(port);
})

afterAll(async () => {
    server.close();
});


test('Testing eq-selection', async () => {
    const stepId = 'selectEq';

    const state: ScenarioState = {
        data: [{
            id: 'availableEqs',
            value: {
                    "type": "FeatureCollection",
                    "features": [
                        {
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
                        },
                    ]
                }
        }, {
            id: 'userChoice',
            value: 0
        }]
    };

    const response = await axios.post(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute`, state);
    const ticket = response.data.ticket;

    let poll: any;
    do {
        await sleep(100);
        poll = await axios.get(`http://localhost:${port}/scenarios/Peru/steps/${stepId}/execute/poll/${ticket}`);
    } while (poll.data.ticket);
    const results = poll.data.results;

    expect(results).toBeTruthy();
    expect(results.data).toBeTruthy();
    expect(results.data.length === 3);

    const result = results.data.find((r: DatumReference) => r.id === 'selectedEq')
    expect(result.id).toBe('selectedEq');
    expect(result.reference);
    
    const fileResponse = await axios.get(`http://localhost:${port}/files/${result.reference}`);
    const data = fileResponse.data;
    expect(data).toBeTruthy();
    expect(data.type).toBe('FeatureCollection');
});

