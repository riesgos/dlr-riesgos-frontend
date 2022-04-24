import * as path from 'path';
import hash from 'object-hash';
import format from 'xml-formatter';
import { FileCache } from '../storage/fileCache';
import { AxiosClient } from '../web/httpClient';
import { WpsClient } from '../wps/public-api';
import { MailAttachment, MailClient } from '../web/mailClient';
import { config } from '../config';
import { writeTextFile } from '../utils/fileApi';
import { decodeEntities } from '../wps/lib/wps200/helpers';




const http = new AxiosClient();
const filePath = config.cacheDir;
const cache = new FileCache(filePath, 24 * 60 * 60);
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
    if (config.useCache) {
        const cachedData = await cache.getData(parsed.url, parsed.processId, key);
        if (cachedData) {
            return cachedData;
        }
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
                requestCounter += 1;
            }).toPromise();
    }

    if (config.useCache) await cache.storeData(parsed.url, parsed.processId, key, newData);
    return newData;
}


interface ProcessState {
    result: any
};

export class ProcessPool {
    private latestId = 0;
    private managedProcesses: {[key: number]: ProcessState} = {};

    constructor(private maxConcurrentExecs = 100) {
        for (let id = 0; id < this.maxConcurrentExecs; id++) {
            this.managedProcesses[id] = { result: null };
        }
    }

    public execute(data: ExecuteData): number {

        // Step 1: get an id under which to find the current process
        const id = this.getNewExecId();
        if (id === null) {
            throw Error(`Cannot execute this request. There are still ${Object.keys(this.managedProcesses).length} requests ongoing.`);
        }
        this.managedProcesses[id] = {
            result: null
        };
        
        // Step 2: run process.
        this.logOutgoingRequest(data);
        const result$ = proxyExecuteRequest(data);
        result$.then((result) => {
            this.managedProcesses[id].result = result;
        }).catch(err => {
            this.handleError(err, data);
            this.managedProcesses[id].result = {error: err.message};
        });
        
        // Step 3: return id for later reference.
        return id;
    }

    public get(id: number) {
        const processData = this.managedProcesses[id];
        if (!processData) return {error: `Server doesn't know about process-id ${id}`}
        const result = processData.result;
        if (result !== null) {
            // clean memory once data has been fetched.
            this.managedProcesses[id].result = null;
            console.log(`Cleaned stored entry nr. ${id} to ${JSON.stringify(this.managedProcesses[id])}`)
            return result;
        } else {
            return null;
        }
    }

    private getNewExecId(): number | null {
        for (let offset = 1; offset <= this.maxConcurrentExecs; offset += 1) {
            const candidateId = (this.latestId + offset) % this.maxConcurrentExecs;
            if (this.managedProcesses[candidateId].result === null) {
                this.latestId = candidateId;
                console.log(`new exec id ${this.latestId}`)
                return this.latestId;
            }
        }
        return null
    }

    private handleError(error: any, data: ExecuteData) {
        console.log('error', error);
    
        const xmlExecBodyPrettified = getExecBody(data);

        const text = `
Target:
${data.url} --- ${data.processId}

Request:
${xmlExecBodyPrettified}

Error:
${error.message}

Stack:
${error.stack}

Time:
${new Date()}
        `;

        const key = `error_message_${new Date().getTime()}`;
        const errorFile = path.join(config.cacheDir, data.url.replace(/:/g, ''), data.processId.replace(/:/g, ''), key + '.txt');
        writeTextFile(errorFile, text).then(() => console.log('error-log written to ', errorFile));


        const attachment: MailAttachment = {
            content: text,
            contentType: 'text',
            encoding: 'utf-8',
            filename: 'attachment.txt',
        };
        mailClient.sendMail(config.siteAdmins, 'Riesgos Middleware: Error on execute-request', 'An error has occurred. See attachment.', [attachment]);
    }
  
    private logOutgoingRequest(data: ExecuteData) {
        const text = `now executing: ${data.url} --- ${data.processId}\n` +  getExecBody(data);
        console.log(text);
        if (config.storeRequestBody) {
            const tempFile = path.join(config.tempDir, data.url.replace(/:/g, ''), data.processId.replace(/:/g, ''), 'tmp.txt');
            writeTextFile(tempFile, text).then(() => console.log('tmp written to ', tempFile));
        }
    }
}

function getExecBody (data: ExecuteData) {
    const client = data.version === '1.0.0' ? wpsClient100 : wpsClient200;
    const execBody = client.wpsMarshaller.marshalExecBody(data.processId, data.inputs, data.outputDescriptions, true);
    const xmlExecBody = decodeEntities(client.xmlMarshaller.marshalString(execBody));
    const xmlExecBodyPrettified = format(xmlExecBody);
    return xmlExecBodyPrettified;
}