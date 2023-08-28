import { WpsMarshaller, WpsInput, WpsVersion, WpsResult, WpsOutputDescription, WpsData, WpsState,
    WpsCapability, WpsProcessDescription } from './wps_datatypes';
import { WpsMarshaller100 } from './wps100/wps_marshaller_1.0.0';
import { WpsMarshaller200 } from './wps200/wps_marshaller_2.0.0';
import { XLink_1_0 } from './jsonix/XLink_1_0';
import { OWS_1_1_0 } from './jsonix/OWS_1_1_0';
import { OWS_2_0 } from './jsonix/OWS_2_0';
import { WPS_1_0_0 } from './jsonix/WPS_1_0_0';
import { WPS_2_0 } from './jsonix/WPS_2_0';
import { Jsonix } from './jsonix/jsonix';
import axios from 'axios';
// import axiosBetterStacktrace from 'axios-better-stacktrace';
// axiosBetterStacktrace(axios);
import { sleep, toPromise } from '../../async';



/**
 * The Wps-client abstracts away the differences between Wps1.0.0 and Wps2.0.0
 * There are two layers of marshalling:
 *  - the Wps-marshaller marshals user-facing data to wps-specific types
 *  - Jsonix marshals wps-specific data to xml.
 * user-facing data -> wpsmarshaller -> Wps-type-specific data -> Jsonix-marhsaller -> XML ->
 * -> webclient -> WPS -> XML -> Jsonix-unmarshaller -> Wps-type-specific data -> wpsmarshaller -> user-facing data
 */
export class WpsClient {

    readonly version: WpsVersion;
    readonly xmlMarshaller: any;
    readonly xmlUnmarshaller: any;
    readonly wpsMarshaller: WpsMarshaller;
    private webClient = axios;

    constructor(
        version: WpsVersion = '1.0.0',
        private verbose = true
    ) {
        this.version = version;
        let context;
        if (this.version === '1.0.0') {
            this.wpsMarshaller = new WpsMarshaller100();
            context = new (Jsonix as any).Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0]);
        } else if (this.version === '2.0.0') {
            this.wpsMarshaller = new WpsMarshaller200();
            context = new (Jsonix as any).Context([XLink_1_0, OWS_2_0, WPS_2_0]);
        } else {
            throw new Error('You entered a WPS version other than 1.0.0 or 2.0.0.');
        }
        this.xmlUnmarshaller = context.createUnmarshaller();
        this.xmlMarshaller = context.createMarshaller();
    }


    async getCapabilities(url: string): Promise<WpsCapability[]> {
        const getCapabilitiesUrl = this.wpsMarshaller.getCapabilitiesUrl(url);
        const response = await this.getRaw(getCapabilitiesUrl);
        const responseJson = this.xmlUnmarshaller.unmarshalString(response);
        return this.wpsMarshaller.unmarshalCapabilities(responseJson.value);
    }

    async describeProcess(url: string, processId: string): Promise<WpsProcessDescription> {
        const describeProcessUrl = this.wpsMarshaller.getDescribeProcessUrl(url, processId);
        const response = await this.getRaw(describeProcessUrl);
        const responseJson = this.xmlUnmarshaller.unmarshalString(response);
        return this.wpsMarshaller.unmarshalProcessDescription(responseJson.value);
    }

    async executeAsync(
            url: string,
            processId: string,
            inputs: WpsInput[],
            outputs: WpsOutputDescription[],
            pollingRate: number = 1000,
            tapFunction?: (response: WpsState | null, paperTrail: string[]) => void,
            unmarshalFunction?: (jsonResponse: any) => WpsData[]
        ): Promise<WpsResult[]> {

        const paperTrail: string[] = [];

        // poll until succeeded
        let currentState = await this.executeAsyncBasic(url, processId, inputs, outputs, paperTrail);
        let noResultsYet = currentState.status !== 'Succeeded';
        while (noResultsYet) {
            currentState = await this.getNextState(currentState, url, processId, inputs, outputs, paperTrail);
            if (currentState.status === 'Failed') {
                throw new Error(`Error during execution of process ${processId}: \n ${currentState.statusLocation || currentState.jobID} \n ${paperTrail.join('\n')}`);
            }
            if (tapFunction) {
                tapFunction(currentState, paperTrail);
            }
            noResultsYet = currentState.status !== 'Succeeded';
            if (noResultsYet) await sleep(pollingRate);
        }

        // fetch results
        const response = await this.fetchResults(currentState, url, processId, inputs, outputs, unmarshalFunction);

        // In case of errors:
        for (const result of response) {
            if (result.description.type === 'error') {
                console.log('server responded with 200, but body contained an error-result: ', result);
                throw new Error(result.value);
            }
        }

        return response;
    }

    async getNextState(currentState: WpsState, serverUrl: string, processId: string, inputs: WpsInput[],
        outputDescriptions: WpsOutputDescription[], paperTrail?: string[]): Promise<WpsState> {

        let request$: Promise<string>;
        if (this.version === '1.0.0') {

            if (!currentState.statusLocation) {
                throw new Error(`GetNextState: No status location: ${currentState}`);
            }
            request$ = this.getRaw(currentState.statusLocation, paperTrail);

        } else if (this.version === '2.0.0') {

            if (!currentState.jobID) {
                throw new Error(`GetNextState: No job-Id: ${currentState}`);
            }
            const execBody = this.wpsMarshaller.marshallGetStatusBody(serverUrl, processId, currentState.jobID);
            const xmlExecBody = this.xmlMarshaller.marshalString(execBody);

            request$ = this.postRaw(serverUrl, xmlExecBody, paperTrail);

        } else {
            throw new Error(`'GetStatus' has not yet been implemented for this WPS-Version (${this.version}).`);
        }

        const xmlResponse = await request$;

        const jsonResponse = this.xmlUnmarshaller.unmarshalString(xmlResponse);
        const output: WpsState =
            this.wpsMarshaller.unmarshalGetStateResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
        return output;
    }

    async fetchResults(lastState: WpsState, serverUrl: string, processId: string, inputs: WpsInput[],
        outputDescriptions: WpsOutputDescription[], unmarshalFunction?: (jsonResponse: any) => WpsData[]): Promise<WpsData[]> {

        if (lastState.results) { // WPS 1.0: results should already be in last state
            let output: WpsData[];
            if (unmarshalFunction) {
                output = unmarshalFunction(lastState.results);
            } else {
                output = this.wpsMarshaller.unmarshalSyncExecuteResponse(lastState.results, serverUrl, processId, inputs, outputDescriptions);
            }
            return toPromise(output);


        } else { // WPS 2.0: get results with post request
            if (!lastState.jobID) {
                throw new Error(`FetchResults: You want me to get a result, but I can't find a jobId. I don't know what to do now!`);
            }

            const execBody = this.wpsMarshaller.marshallGetResultBody(serverUrl, processId, lastState.jobID);
            const xmlExecBody = this.xmlMarshaller.marshalString(execBody);

            const xmlResponse = await this.postRaw(serverUrl, xmlExecBody);
            const jsonResponse = this.xmlUnmarshaller.unmarshalString(xmlResponse);
            let output: WpsData[];
            if (unmarshalFunction) {
                output = unmarshalFunction(jsonResponse);
            } else {
                output = this.wpsMarshaller.unmarshalSyncExecuteResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
            }
            return output;
        }
    }

    async executeAsyncBasic(url: string, processId: string, inputs: WpsInput[],
        outputDescriptions: WpsOutputDescription[], paperTrail?: string[]): Promise<WpsState> {

        const executeUrl = this.wpsMarshaller.executeUrl(url, processId);
        const execBody = this.wpsMarshaller.marshalExecBody(processId, inputs, outputDescriptions, true);
        const xmlExecBody = this.xmlMarshaller.marshalString(execBody);

        const xmlResponse = await this.postRaw(executeUrl, xmlExecBody, paperTrail);

        const jsonResponse = this.xmlUnmarshaller.unmarshalString(xmlResponse);
        const output: WpsState =
            this.wpsMarshaller.unmarshalAsyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
        return output;
    }

    async execute(url: string, processId: string, inputs: WpsInput[],
        outputDescriptions: WpsOutputDescription[], unmarshalFunction?: (jsonResponse: any) => WpsData[]): Promise<WpsResult[]> {

        const executeUrl = this.wpsMarshaller.executeUrl(url, processId);
        const execbody = this.wpsMarshaller.marshalExecBody(processId, inputs, outputDescriptions, false);
        const xmlExecbody = this.xmlMarshaller.marshalString(execbody);

        const xmlResponse = await this.postRaw(executeUrl, xmlExecbody);
        const jsonResponse = this.xmlUnmarshaller.unmarshalString(xmlResponse);
        if (unmarshalFunction) {
            return unmarshalFunction(jsonResponse);
        }
        const output: WpsData[] =
            this.wpsMarshaller.unmarshalSyncExecuteResponse(jsonResponse, url, processId, inputs, outputDescriptions);
        return output;
    }

    async dismiss(serverUrl: string, processId: string, jobId: string): Promise<any> {
        const dismissUrl = this.wpsMarshaller.dismissUrl(serverUrl, processId, jobId);
        const dismissBody = this.wpsMarshaller.marshalDismissBody(jobId);
        const xmlDismissBody = this.xmlMarshaller.marshalString(dismissBody);

        const xmlResponse = await this.postRaw(dismissUrl, xmlDismissBody);
        const jsonResponse = this.xmlUnmarshaller.unmarshalString(xmlResponse);
        const output = this.wpsMarshaller.unmarshalDismissResponse(jsonResponse, serverUrl, processId);
        return output;
    }

    async postRaw(url: string, xmlBody: string, paperTrail: string[] = []): Promise<string> {
        // Side-effect to keep track of raw xml
        const message = JSON.stringify({ type: 'POST', url, xmlBody });
        if (this.verbose) console.log(message);
        paperTrail.push(message);

        const result = await this.webClient.post(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml',
                'Accept': 'text/xml, application/xml'
            },
            responseType: 'text',
            // maxContentLength: Infinity,   // exposure is often very large 
            // maxBodyLength: Infinity       // exposure is often very large
        });

        // Side-effect to keep track of raw xml
        const message2 = JSON.stringify({ type: 'POST-response', url, result: result.data });
        if (this.verbose) console.log(message2);
        paperTrail.push(message2);

        this.parseResponseForErrors(url, result.data, paperTrail);
        return result.data;
    }

    async getRaw(url: string, paperTrail: string[] = []): Promise<string> {
        // Side-effect to keep track of raw xml
        const message = JSON.stringify({ type: 'GET', url });
        if (this.verbose) console.log(message);
        paperTrail.push(message);

        const result = await this.webClient.get(url, {
            headers: {
                'Accept': 'text/xml, application/xml'
            },
            responseType: 'text'
        });

        this.parseResponseForErrors(url, result.data, paperTrail);
        return result.data;
    }

    private parseResponseForErrors(url: string, response: string, paperTrail: string[]): void {
        if (response.match('<title>404 Not Found</title>') || response.match('ows:ExceptionReport')) {
            const message = `Error from remote server: From ${url}:  ` + response + `\n\n ${paperTrail.join('\n')}`;
            console.error(message);
            throw new Error(message);
        }
    }

}
