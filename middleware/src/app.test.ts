import { ExecuteData } from './express/serverLogic';
import { sleep } from './utils/async';
import { AxiosClient } from './web/httpClient';
import path from 'path';
import { deleteFile, readJsonFile, writeJsonFile } from './utils/fileApi';
import { createExpressApp } from './express/serverInterface';
import { config } from './config';



const sendLiveRequests = false;




const requestData: ExecuteData = {
    "version": "1.0.0",
    "inputs": [
        { "uid": "eq_exposure_model_choice", "description": { "wizardProperties": { "fieldtype": "stringselect", "name": "model", "description": "exposure model" }, "id": "model", "reference": false, "title": "model", "type": "literal", "options": ["ValpCVTSaraDownscaled", "ValpCVTBayesian", "ValpCommuna", "ValpRegularOriginal", "ValpRegularGrid"], "defaultValue": "ValpCVTSaraDownscaled" }, "value": "ValpCVTSaraDownscaled" },
        { "uid": "lonmin", "description": { "id": "lonmin", "title": "lonmin", "type": "literal", "reference": false, "defaultValue": "-71.8" }, "value": "-71.8" },
        { "uid": "lonmax", "description": { "id": "lonmax", "title": "lonmax", "type": "literal", "reference": false, "defaultValue": "-71.4" }, "value": "-71.4" },
        { "uid": "latmin", "description": { "id": "latmin", "title": "latmin", "type": "literal", "reference": false, "defaultValue": "-33.2" }, "value": "-33.2" },
        { "uid": "latmax", "description": { "id": "latmax", "title": "latmax", "type": "literal", "reference": false, "defaultValue": "-33.0" }, "value": "-33.0" },
        { "uid": "schema", "description": { "id": "schema", "title": "schema", "reference": false, "type": "literal" }, "value": "SARA_v1.0" },
        { "uid": "assettype", "description": { "id": "assettype", "title": "", "defaultValue": "res", "reference": false, "type": "literal" }, "value": "res" },
        { "uid": "querymode", "description": { "id": "querymode", "title": "", "defaultValue": "intersects", "reference": false, "type": "literal" }, "value": "intersects" }
    ],
    "outputDescriptions": [
        { "id": "selectedRowsGeoJson", "title": "", "icon": "building", "type": "complex", "reference": false, "format": "application/json", "name": "Exposure", "vectorLayerAttributes": { "legendEntries": [{ "feature": { "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [[[5.627918243408203, 50.963075942052164], [5.627875328063965, 50.958886259879264], [5.635471343994141, 50.95634523633128], [5.627918243408203, 50.963075942052164]]] }, "properties": { "expo": { "Damage": [], "Buildings": [] } } }, "text": "exposureLegend" }] } },
        { "id": "selectedRowsGeoJson", "reference": true, "title": "", "type": "complex" }
    ],
    "processId": "org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess",
    "url": "https://rz-vm140.gfz-potsdam.de:8443/wps/WebProcessingService"
};

if (sendLiveRequests) {
    const http = new AxiosClient();
    const app = createExpressApp();
    const server = app.listen(config.port, () => {
        console.log(`App listening on http://localhost:${config.port}`);
    });
    const timeOut = 30000;
    console.warn('Making actual http-requests to a backend for the following tests');

    test('testing express interface', async () => {
        const ack = await http.post(`http://localhost:${config.port}/execute`, JSON.stringify(requestData), {headers: {'Content-Type': 'application/json'}});
        let results = null;
        while(results === null) {
            await sleep(5000);
            results = await http.get(`http://localhost:${config.port}/execute/${ack.id}`);
        }
        expect(results).toBeTruthy();
    }, timeOut);
}


test('test writing and reading files', async () => {
    const filePath = path.join(config.cacheDir, 'test', 'subtest', 'text.json');
    // const filePath = path.join(__dirname, '..', "data/https/rz-vm140.gfz-potsdam.de:8443/wps/WebProcessingService/org.n52.gfz.riesgos.algorithm.impl.AssetmasterProcess");
    const content = {test: 'true'};
    await writeJsonFile(filePath, content);
    const parsedContent = await readJsonFile(filePath);
    expect(parsedContent).toEqual(content);
    await deleteFile(filePath); 
});



