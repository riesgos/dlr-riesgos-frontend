import { delay, firstValueFrom, map, mergeMap, Observable, switchMap, tap } from 'rxjs';
import { ExecuteData, proxyExecuteRequest } from './serverLogic';
import { sleep } from './utils/async';
import { AxiosClient } from './web/httpClient';
import { pollUntil, WpsClient, WpsData, WpsState } from './wps/public-api';
import path from 'path';
import { deleteFile, writeJsonFile } from './utils/fileApi';


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
    "url": "https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService"
};

const http = new AxiosClient();
const wpsClient100 = new WpsClient('1.0.0', http);

async function main() {
    // Test 1
    // const response = await proxyExecuteRequest(requestData);
    // console.log(response);
    // <=============== fails

    // Test 2
    // let requestCounter = 0;
    // const newData = await firstValueFrom(wpsClient100.executeAsync(
    //     requestData.url, requestData.processId, requestData.inputs, requestData.outputDescriptions,
    //     5000, (data) => {
    //         console.log(`requesting. (${requestCounter}) `, data);
    //         requestCounter += 1;
    // }));
    // <================ fails

    // Test 3
    // const confirmation: WpsState = await wpsClient100
    //     .executeAsyncBasic(requestData.url, requestData.processId, requestData.inputs, requestData.outputDescriptions)
    //     .toPromise() as WpsState;
    // await sleep(5000);
    // const state = await wpsClient100
    //     .getNextState(confirmation, requestData.url, requestData.processId, requestData.inputs, requestData.outputDescriptions)
    //     .toPromise();
    // console.log(state);
    // <=============== passes


    // // Test 4
    // const {url, processId, inputs, outputDescriptions} = requestData;
    // const executeRequest$: Observable<WpsState> = wpsClient100.executeAsyncBasic(url, processId, inputs, outputDescriptions);
    // let queryCount = 0;
    // const query$ = executeRequest$.pipe(
    //     // poll until succeeded
    //     mergeMap((currentState: WpsState) => {
    //         const nextState$: Observable<WpsState> = wpsClient100.getNextState(currentState, url, processId, inputs, outputDescriptions);
    //         const poll$: Observable<WpsState> = pollUntil<WpsState>(
    //             nextState$,
    //             (response: WpsState) => {
    //                 if (response.status === 'Failed') {
    //                     throw new Error(`Error during execution of process ${processId}: ` + response.statusLocation);
    //                 }
    //                 return response.status === 'Succeeded';
    //             },
    //             (t: WpsState | null) => {
    //                 console.log(`Polling ... (${queryCount})`, t?.status);
    //                 queryCount += 1;
    //             },
    //             3000
    //         );
    //         return poll$;
    //     }),
    //     // fetch results
    //     mergeMap((lastState: WpsState) => {
    //         return wpsClient100.fetchResults(lastState, url, processId, inputs, outputDescriptions);
    //     })
    // );
    // const data = await firstValueFrom(query$);
    // console.log(data);
    // <======================================== fails


    // const {url, processId, inputs, outputDescriptions} = requestData;
    // const firstResponse$ = wpsClient100.executeAsyncBasic(url, processId, inputs, outputDescriptions);
    // const secondState$ = firstResponse$.pipe(
    //     switchMap(r => {
    //         const nextState$: Observable<WpsState> = wpsClient100.getNextState(r, url, processId, inputs, outputDescriptions);
    //         return nextState$;
    //     })
    // );
    // const thirdState$ = secondState$.pipe(
    //     delay(3000),
    //     switchMap(r => {
    //         const nextState$: Observable<WpsState> = wpsClient100.getNextState(r, url, processId, inputs, outputDescriptions);
    //         return nextState$;
    //     })
    // )
    // const data = await firstValueFrom(thirdState$);
    // console.log(data);


    // test 5: passes
    // const filePath = path.join(__dirname, '..', 'data', 'test', 'subtest', 'text.json');
    // await writeJsonFile(filePath, {test: 'true'});
    // await deleteFile(filePath); 

    // test 6
    const filePath = path.join(__dirname, '..', 'data', 'https://michael.com/some/subdir', 'text.json');
    await writeJsonFile(filePath, {test: 'true'});
}


main();