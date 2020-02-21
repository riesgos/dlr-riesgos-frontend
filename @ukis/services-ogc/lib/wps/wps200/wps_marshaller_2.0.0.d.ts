import { WpsMarshaller, WpsInput, WpsOutputDescription, WpsResult, WpsCapability, WpsDataDescription, WpsData, WpsState } from '../wps_datatypes';
import { WPSCapabilitiesType, IWpsExecuteProcessBody, IWpsExecuteResponse, IGetStatusRequest, Data, IGetResultRequest, IDismissRequest, IDismissResponse } from './wps_2.0';
export declare class WpsMarshaller200 implements WpsMarshaller {
    constructor();
    getCapabilitiesUrl(baseurl: string): string;
    executeUrl(baseurl: string, processId: string): string;
    unmarshalCapabilities(capabilities: WPSCapabilitiesType): WpsCapability[];
    unmarshalSyncExecuteResponse(responseJson: IWpsExecuteResponse, url: string, processId: string, inputs: WpsInput[], outputDescriptions: WpsOutputDescription[]): WpsResult[];
    protected unmarshalOutputData(data: Data, description: WpsOutputDescription): any;
    unmarshalAsyncExecuteResponse(responseJson: any, url: string, processId: string, inputs: WpsData[], outputDescriptions: WpsDataDescription[]): WpsState;
    unmarshalGetStateResponse(responseJson: any, serverUrl: string, processId: string, inputs: WpsData[], outputDescriptions: WpsDataDescription[]): WpsState;
    marshalExecBody(processId: string, inputs: WpsInput[], outputs: WpsOutputDescription[], async: boolean): IWpsExecuteProcessBody;
    private marshalInputs;
    private marshalOutputs;
    marshallGetStatusBody(serverUrl: string, processId: string, statusId: string): IGetStatusRequest;
    marshallGetResultBody(serverUrl: string, processId: string, jobID: string): IGetResultRequest;
    dismissUrl(serverUrl: string, processId: string, jobId: string): string;
    marshalDismissBody(jobId: string): IDismissRequest;
    unmarshalDismissResponse(jsonResponse: IDismissResponse, serverUrl: string, processId: string): WpsState;
}
