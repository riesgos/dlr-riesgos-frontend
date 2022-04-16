import { FileCache } from '../storage/fileCache';
import { AxiosClient } from '../web/httpClient';
import { WpsClient } from '../wps/public-api';
import * as path from 'path';
import hash from 'object-hash';
import { MailAttachment, MailClient } from '../web/mailClient';
import { config } from '../config';
import { writeTextFile } from '../utils/fileApi';




const http = new AxiosClient();
const filePath = path.join(__dirname, '../../data');
const cache = new FileCache(filePath, 3 * 60 * 60);
const wpsClient100 = new WpsClient('1.0.0', http);
const wpsClient200 = new WpsClient('2.0.0', http);
const mailClient = new MailClient();


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


interface ProcessState {
    result: any
}

export class ProcessPool {
    private latestId = 0;
    private managedProcesses: {[key: number]: ProcessState} = {};

    constructor(private maxConcurrentExecs = 100) {}

    public execute(data: ExecuteData): number {

        // Step 1: get an id under which to find the current process
        const id = this.getNewExecId();
        if (this.managedProcesses[id]) {
            throw Error(`Cannot execute this request. There are still ${Object.keys(this.managedProcesses).length} requests ongoing.`);
        }
        this.managedProcesses[id] = {
            result: null
        };
        
        // Step 2: run process.
        const result$ = proxyExecuteRequest(data);
        result$.then((result) => {
            this.managedProcesses[id].result = result;
        }).catch(reason => {
            this.handleError(reason, data);
        });
        
        // Step 3: return id for later reference.
        return id;
    }

    public get(id: number) {
        const state = this.managedProcesses[id];
        const result = state.result;
        if (result !== null) {
            // clean memory once data has been fetched.
            delete(this.managedProcesses[id]);
            return result;
        } else {
            return null;
        }
    }

    private getNewExecId(): number {
        this.latestId = (this.latestId + 1) % this.maxConcurrentExecs;
        return this.latestId;
    }

    private handleError(error: any, data: ExecuteData) {
        console.log('error', error);
            
        const client = data.version === '1.0.0' ? wpsClient100 : wpsClient200;
        const execBody = client.wpsMarshaller.marshalExecBody(data.processId, data.inputs, data.outputDescriptions, true);
        const xmlExecBody = client.xmlMarshaller.marshalString(execBody);

        const text = `
Request:
${xmlExecBody}

Error:
${error.message}

Stack:
${error.stack}

Time:
${new Date()}
        `;

        const key = `error_message_${new Date().getTime()}`;
        const errorFile = path.join(__dirname, '..', '..', 'data', data.url.replace(/:/g, ''), data.processId.replace(/:/g, ''), key + '.txt');
        writeTextFile(errorFile, text).then(() => console.log('error-log written to ', errorFile));


        const attachment: MailAttachment = {
            content: text,
            contentType: 'text',
            encoding: 'utf-8',
            filename: 'attachment.txt',
        };
        mailClient.sendMail(config.siteAdmins, 'Riesgos Middleware: Error on execute-request', 'An error has occurred. See attachment.', [attachment]);
    }
}