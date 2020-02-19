import { WpsMarshaller, WpsInput, WpsOutputDescription, WpsResult, WpsCapability, WpsData, WpsDataDescription, WpsState } from '../wps_datatypes';
import { WPSCapabilitiesType, IWpsExecuteProcessBody, DataInputsType, InputType, ResponseFormType, DataType, IWpsExecuteResponse, InputReferenceType } from './wps_1.0.0';
export declare class WpsMarshaller100 implements WpsMarshaller {
    constructor();
    getCapabilitiesUrl(baseurl: string): string;
    executeUrl(baseurl: string, processId: string): string;
    unmarshalCapabilities(capabilities: WPSCapabilitiesType): WpsCapability[];
    unmarshalSyncExecuteResponse(responseJson: IWpsExecuteResponse, url: string, processId: string, inputs: WpsInput[], outputDescriptions: WpsOutputDescription[]): WpsResult[];
    protected unmarshalOutputData(data: DataType): any;
    unmarshalAsyncExecuteResponse(responseJson: any, url: string, processId: string, inputs: WpsInput[], outputDescriptions: WpsDataDescription[]): WpsState;
    unmarshalGetStateResponse(responseJson: any, serverUrl: string, processId: string, inputs: WpsData[], outputDescriptions: WpsDataDescription[]): WpsState;
    marshalExecBody(processId: string, inputs: WpsInput[], outputs: WpsOutputDescription[], async: boolean): IWpsExecuteProcessBody;
    protected marshalResponseForm(outputs: WpsOutputDescription[], async?: boolean): ResponseFormType;
    protected marshalInputs(inputArr: WpsInput[]): DataInputsType;
    protected marshalInput(input: WpsInput): InputType;
    protected marshalDataInput(input: WpsInput): DataType;
    protected marshalReferenceInput(input: WpsInput): InputReferenceType;
    marshallGetStatusBody(serverUrl: string, processId: string, statusId: string): {};
    marshallGetResultBody(serverUrl: string, processId: string, jobID: string): {};
    dismissUrl(serverUrl: string, processId: string, jobId: string): string;
    marshalDismissBody(processId: string): void;
    unmarshalDismissResponse(jsonResponse: any, serverUrl: string, processId: string): WpsState;
}
