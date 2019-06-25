import { WpsClient, WpsData } from 'projects/services-wps/src/public_api';
import { Process } from '../control/workflowcontrol';
import { HttpClient } from '@angular/common/http';




export class EqTsInteraction extends Process {

    constructor(httpClient: HttpClient) {

        const id: string = "org.n52.project.riesgos.GetEpicentersProcess";

        const url: string = "http://tsunami-riesgos.awi.de:8080/wps/WebProcessingService";

        const inputs: WpsData[] = [{
            id: "input-boundingbox",
            reference: false,
            type: "bbox",
            data: null
        }];

        const output: WpsData = {
            id: "epicenters",
            reference: false,
            format: "application/vnd.geo+json",
            type: "complex",
            data: null
        };

        super(id, url, inputs, output, new WpsClient("1.0.0", httpClient));

    }

}