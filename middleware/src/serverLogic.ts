import { FileCache } from './storage/fileCache';
import { AxiosClient } from './web/httpClient';
import { WpsClient } from './wps/public-api';
import * as path from 'path';
import hash from 'object-hash';

const filePath = path.join(__dirname, '../data');


const http = new AxiosClient();
const cache = new FileCache(filePath, 3 * 60 * 60);
const wpsClient100 = new WpsClient('1.0.0', http);
const wpsClient200 = new WpsClient('2.0.0', http);



export interface ExecuteData {
    version: '1.0.0' | '2.0.0',
    url: string,
    processId: string,
    inputs: any[],
    outputDescriptions: any[]
}

export async function proxyExecuteRequest(parsed: ExecuteData) {

    const key = hash(parsed);
    const cachedData = await cache.getData(parsed.url, parsed.processId, key);
    if (cachedData) {
        return cachedData;
    }
    let newData;
    let requestCounter = 0;
    if (parsed.version === '1.0.0') {
        newData = await wpsClient100.executeAsync(
            parsed.url, parsed.processId, parsed.inputs, parsed.outputDescriptions,
            5000, (data) => {
                requestCounter += 1;
            }).toPromise();
    } else {
        newData = await wpsClient200.executeAsync(
            parsed.url, parsed.processId, parsed.inputs, parsed.outputDescriptions,
            5000, (data) => {
                console.log(`requesting. (${requestCounter}) `, data);
                requestCounter += 1;
            }).toPromise();
    }
    await cache.storeData(parsed.url, parsed.processId, key, newData);
    return newData;
}
