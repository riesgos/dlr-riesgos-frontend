export declare type WpsVerion = '1.0.0' | '2.0.0';
export declare type WpsDataFormat = 'application/vnd.geo+json' | 'application/json' | 'application/WMS' | 'application/xml' | 'text/xml' | 'application/text' | 'image/geotiff' | 'text/plain';
export declare type ProcessId = string;
export declare type ProductId = string;
export interface WpsDataDescription {
    id: ProductId;
    type: 'literal' | 'complex' | 'bbox' | 'status' | 'error';
    reference: boolean;
    format?: WpsDataFormat;
    description?: string;
    defaultValue?: any;
}
export declare type WpsInputDescription = WpsDataDescription;
export declare type WpsOutputDescription = WpsDataDescription;
export interface WpsData {
    description: WpsDataDescription;
    value: any;
}
export declare type WpsInput = WpsData;
export declare type WpsResult = WpsData;
export interface WpsBboxDescription {
    id: ProductId;
    type: 'bbox';
    reference: boolean;
    format?: WpsDataFormat;
    description?: string;
    defaultValue?: any;
}
export interface WpsBboxValue {
    crs: string;
    lllon: number;
    lllat: number;
    urlon: number;
    urlat: number;
}
export declare const isBbox: (obj: object) => obj is WpsBboxValue;
export interface WpsState {
    status: 'Succeeded' | 'Failed' | 'Accepted' | 'Running' | 'Dismissed';
    percentCompleted?: number;
    /** WPS 2.0 only */
    jobID?: string;
    /** WPS 1.0 only */
    statusLocation?: string;
    /** WPS 1.0 only: a success-state already contains the results */
    results?: WpsData[];
}
export declare function isWpsState(obj: object): obj is WpsState;
export interface WpsBboxData {
    description: WpsBboxDescription;
    value: WpsBboxValue;
}
export interface WpsCapability {
    id: string;
}
export interface WpsMarshaller {
    executeUrl(url: string, processId: string): string;
    dismissUrl(serverUrl: string, processId: string, jobId: string): string;
    getCapabilitiesUrl(baseurl: string): string;
    marshalExecBody(processId: string, inputs: WpsInput[], outputs: WpsOutputDescription[], async: boolean): any;
    marshallGetStatusBody(serverUrl: string, processId: string, statusId: string): any;
    marshallGetResultBody(serverUrl: string, processId: string, jobID: string): any;
    marshalDismissBody(jobId: string): any;
    unmarshalCapabilities(capabilitiesJson: any): WpsCapability[];
    unmarshalSyncExecuteResponse(responseJson: any, url: string, processId: string, inputs: WpsInput[], outputDescriptions: WpsOutputDescription[]): WpsResult[];
    unmarshalAsyncExecuteResponse(responseJson: any, url: string, processId: string, inputs: WpsInput[], outputDescriptions: WpsOutputDescription[]): WpsState;
    unmarshalGetStateResponse(jsonResponse: any, serverUrl: string, processId: string, inputs: WpsInput[], outputDescriptions: WpsOutputDescription[]): WpsState;
    unmarshalDismissResponse(jsonResponse: any, serverUrl: string, processId: string): WpsState;
}
