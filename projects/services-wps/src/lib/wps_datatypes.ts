export type WpsVerion = "1.0.0" | "2.0.0";
export type WpsDataFormat = "application/vnd.geo+json" | "application/WMS" | "application/xml"; 



export interface WpsDataDescription {
    id: string;
    type: "literal" | "complex" | "bbox" | "status";
    reference: boolean;
    format?: WpsDataFormat;
    description?: string;
    defaultValue?: any;
}
export type WpsInputDescription = WpsDataDescription; 
export type WpsOutputDescription = WpsDataDescription;


export interface WpsData extends WpsDataDescription {
    data: any;
}
export type WpsInput = WpsData;
export type WpsResult = WpsData;


export interface WpsCapability {
    id: string,
}


export interface WpsMarshaller {

    getCapabilitiesUrl(baseurl: string): string;
    executeUrl(url: string, processId: string): string;

    unmarshalCapabilities(capabilitiesJson: any): WpsCapability[];
    unmarshalExecuteResponse(responseJson: any): WpsResult[];

    marshalExecBody(processId: string, inputs: WpsInput[], output: WpsOutputDescription, async: boolean): any;
}
