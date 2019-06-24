import { Process } from 'projects/workflowcontrol/src/public_api';
import { WpsInputDescription, WpsOutputDescription } from 'projects/services-wps/src/public_api';




export interface WpsProcess extends Process {
    readonly url: string;
    readonly inputDescriptions: WpsInputDescription[];
    readonly outputDescription: WpsOutputDescription;
}