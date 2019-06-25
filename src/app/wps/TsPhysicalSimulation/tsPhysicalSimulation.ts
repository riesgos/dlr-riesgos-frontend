import { WpsDataDescription, WpsClient, WpsData } from 'projects/services-wps/src/public_api';
import { Process } from '../control/workflowcontrol';
import { HttpClient } from '@angular/common/http';




export class TsPhysicalSimulation extends Process {

    constructor(httpClient: HttpClient) {

        const id: string = "get_tsunamap";

        const url: string = "http://tsunami-wps.awi.de/wps";

        const inputs: WpsData[] = [{
            id: "lat",
            reference: false,
            type: "literal",
            data: null
        }, {
            id: "lon",
            reference: false,
            type: "literal",
            data: null
        }, {
            id: "mag",
            reference: false,
            type: "literal",
            data: null
        }];

        const output: WpsData = {
            id: "tsunamap",
            type: "complex",
            format: "application/xml",
            reference: false,
            data: null
        };

        super(id, url, inputs, output, new WpsClient("1.0.0", httpClient));

    }

}