import { WpsInput, WpsVerion, WpsResult, WpsOutputDescription, WpsState } from './wps_datatypes';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cache } from './cache';
/**
 * The Wps-client abstracts away the differences between Wps1.0.0 and Wps2.0.0
 * There are two layers of marshalling:
 *  - the Wps-marshaller marshals user-facing data to wps-specific types
 *  - Jsonix marshals wps-specific data to xml.
 * user-facing data -> wpsmarshaller -> Wps-type-specific data -> Jsonix-marhsaller -> XML ->
 * -> webclient -> WPS -> XML -> Jsonix-unmarshaller -> Wps-type-specific data -> wpsmarshaller -> user-facing data
 */
export declare class WpsClient {
    private webclient;
    private version;
    private xmlmarshaller;
    private xmlunmarshaller;
    private wpsmarshaller;
    private cache;
    constructor(version: WpsVerion, webclient: HttpClient, cache?: Cache);
    getCapabilities(url: string): Observable<any>;
    describeProcess(processId: string): Observable<any>;
    executeAsync(url: string, processId: string, inputs: WpsInput[], outputs: WpsOutputDescription[], pollingRate?: number, tapFunction?: (response: WpsState | null) => any): Observable<WpsResult[]>;
    private cachedQuery;
    private getNextState;
    private fetchResults;
    private executeAsyncS;
    execute(url: string, processId: string, inputs: WpsInput[], outputDescriptions: WpsOutputDescription[]): Observable<WpsResult[]>;
    dismiss(serverUrl: string, processId: string, jobId: string): Observable<any>;
    postRaw(url: string, xmlBody: string): Observable<string>;
    getRaw(url: string): Observable<string>;
}
