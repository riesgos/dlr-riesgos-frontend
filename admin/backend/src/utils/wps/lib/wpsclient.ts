import { WpsMarshaller, WpsInput, WpsVersion, WpsResult, WpsOutputDescription, WpsData, WpsState,
    WpsCapability, WpsProcessDescription } from './wps_datatypes';
import { WpsMarshaller100 } from './wps100/wps_marshaller_1.0.0';
import { WpsMarshaller200 } from './wps200/wps_marshaller_2.0.0';
//@ts-ignore
import * as XLink_1_0_Factory from 'w3c-schemas/lib/XLink_1_0'; const XLink_1_0 = XLink_1_0_Factory.XLink_1_0;
//@ts-ignore
import * as OWS_1_1_0_Factory from 'ogc-schemas/lib/OWS_1_1_0'; const OWS_1_1_0 = OWS_1_1_0_Factory.OWS_1_1_0;
//@ts-ignore
import * as OWS_2_0_Factory from 'ogc-schemas/lib/OWS_2_0'; const OWS_2_0 = OWS_2_0_Factory.OWS_2_0;
//@ts-ignore
import * as WPS_1_0_0_Factory from 'ogc-schemas/lib/WPS_1_0_0'; const WPS_1_0_0 = WPS_1_0_0_Factory.WPS_1_0_0;
//@ts-ignore
import * as WPS_2_0_Factory from 'ogc-schemas/lib/WPS_2_0'; const WPS_2_0 = WPS_2_0_Factory.WPS_2_0;
//@ts-ignore
import * as JsonixFactory from './jsonix/jsonix'; const Jsonix = JsonixFactory.Jsonix as any;
import axios from 'axios';




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
        version: WpsVersion = '1.0.0'
    ) {
        this.version = version;
        let context;
        if (this.version === '1.0.0') {
            this.wpsMarshaller = new WpsMarshaller100();
            context = new Jsonix.Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0]);
        } else if (this.version === '2.0.0') {
            this.wpsMarshaller = new WpsMarshaller200();
            context = new Jsonix.Context([XLink_1_0, OWS_2_0, WPS_2_0]);
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
        url: string, processId: string,
        inputs: WpsInput[], outputs: WpsOutputDescription[],
        pollingRate: number = 1000,
        tapFunction?: (response: WpsState | null) => any,
        unmarshalFunction?: (jsonResponse: any) => WpsData[]
        ): Promise<WpsResult[]> {

        const currentState = await this.executeAsyncBasic(url, processId, inputs, outputs);
        // poll until succeeded
        const nextState$ = await this.getNextState(currentState, url, processId, inputs, outputs);

        const query$ = executeRequest$.pipe(

            mergeMap((currentState: WpsState) => {

                const poll$: Promise<WpsState> = pollUntil<WpsState>(
                    nextState$,
                    (response: WpsState) => {
                        if (response.status === 'Failed') {
                            throw new Error(`Error during execution of process ${processId}: ` + response.statusLocation);
                        }
                        return response.status === 'Succeeded';
                    },
                    tapFunction,
                    pollingRate
                );

                return poll$;
            }),

            // fetch results
            mergeMap((lastState: WpsState) => {
                return this.fetchResults(lastState, url, processId, inputs, outputs, unmarshalFunction);
            }),

            // In case of errors:
            tap((response: WpsData[]) => {
                for (const result of response) {
                    if (result.description.type === 'error') {
                        console.log('server responded with 200, but body contained an error-result: ', result);
                        throw new Error(result.value);
                    }
                }
            })
        );

        return query$;
    }

    getNextState(currentState: WpsState, serverUrl: string, processId: string, inputs: WpsInput[],
        outputDescriptions: WpsOutputDescription[]): Promise<WpsState> {

        let request$: Promise<string>;
        if (this.version === '1.0.0') {

            if (!currentState.statusLocation) {
                throw new Error('No status location');
            }
            request$ = this.getRaw(currentState.statusLocation);

        } else if (this.version === '2.0.0') {

            if (!currentState.jobID) {
                throw new Error('No job-Id');
            }
            const execBody = this.wpsMarshaller.marshallGetStatusBody(serverUrl, processId, currentState.jobID);
            const xmlExecBody = this.xmlMarshaller.marshalString(execBody);

            request$ = this.postRaw(serverUrl, xmlExecBody);

        } else {
            throw new Error(`'GetStatus' has not yet been implemented for this WPS-Version (${this.version}).`);
        }

        const request1$: Promise<WpsState> = request$.pipe(
            delayedRetry(2000, 2),
            map((xmlResponse: string) => {
                const jsonResponse = this.xmlUnmarshaller.unmarshalString(xmlResponse);
                const output: WpsState =
                    this.wpsMarshaller.unmarshalGetStateResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
                return output;
            })
        );

        return request1$;
    }

    fetchResults(lastState: WpsState, serverUrl: string, processId: string, inputs: WpsInput[],
        outputDescriptions: WpsOutputDescription[], unmarshalFunction?: (jsonResponse: any) => WpsData[]): Promise<WpsData[]> {

        if (lastState.results) { // WPS 1.0: results should already be in last state
            let output: WpsData[];
            if (unmarshalFunction) {
                output = unmarshalFunction(lastState.results);
            } else {
                output = this.wpsMarshaller.unmarshalSyncExecuteResponse(lastState.results, serverUrl, processId, inputs, outputDescriptions);
            }
            return of(output);


        } else { // WPS 2.0: get results with post request
            if (!lastState.jobID) {
                throw new Error(`You want me to get a result, but I can't find a jobId. I don't know what to do now!`);
            }

            const execBody = this.wpsMarshaller.marshallGetResultBody(serverUrl, processId, lastState.jobID);
            const xmlExecBody = this.xmlMarshaller.marshalString(execBody);

            return this.postRaw(serverUrl, xmlExecBody).pipe(
                map((xmlResponse: string) => {
                    const jsonResponse = this.xmlUnmarshaller.unmarshalString(xmlResponse);
                    let output: WpsData[];
                    if (unmarshalFunction) {
                        output = unmarshalFunction(jsonResponse);
                    } else {
                        output = this.wpsMarshaller.unmarshalSyncExecuteResponse(jsonResponse, serverUrl, processId, inputs, outputDescriptions);
                    }
                    return output;
                }),
            );
        }
    }

    async executeAsyncBasic(url: string, processId: string, inputs: WpsInput[],
        outputDescriptions: WpsOutputDescription[]): Promise<WpsState> {

        const executeUrl = this.wpsMarshaller.executeUrl(url, processId);
        const execBody = this.wpsMarshaller.marshalExecBody(processId, inputs, outputDescriptions, true);
        const xmlExecBody = this.xmlMarshaller.marshalString(execBody);

        const xmlResponse = await this.postRaw(executeUrl, xmlExecBody);
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

    async postRaw(url: string, xmlBody: string): Promise<string> {
        const result = await this.webClient.post<any, string>(url, xmlBody, {
            headers: {
                'Content-Type': 'text/xml',
                'Accept': 'text/xml, application/xml'
            },
            responseType: 'text'
        });
        this.parseResponseForErrors(url, result);
        return result;
    }

    async getRaw(url: string): Promise<string> {
        const result = await this.webClient.get<any, string>(url, {
            headers: {
                'Accept': 'text/xml, application/xml'
            },
            responseType: 'text'
        });
        this.parseResponseForErrors(url, result);
        return result;
    }

    private parseResponseForErrors(url: string, response: string): void {
        if (response.match('<title>404 Not Found</title>') || response.match('ows:ExceptionReport')) {
            throw new Error(`From ${url}:  ` + response);
        }
    }

}
