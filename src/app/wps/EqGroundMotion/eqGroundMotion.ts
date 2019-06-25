import { WpsData, WpsClient } from 'projects/services-wps/src/public_api';
import { Process } from '../control/workflowcontrol';
import { HttpClient } from '@angular/common/http';




export class EqGroundMotion extends Process {

    constructor(httpClient: HttpClient) {

        const id: string = "org.n52.wps.python.algorithm.ShakemapProcess";

        const url: string = "https://riesgos.52north.org/wps/WebProcessingService";

        const inputs: WpsData[] = [{
            id: "quakeml-input",
            data: null,
            format: "application/vnd.geo+json",
            reference: false,
            type: "complex"
        }];

        const output: WpsData = {
            id: "shakemap-output",
            data: null,
            type: "complex",
            reference: false,
            format: "application/WMS"
        };

        super(id, url, inputs, output, new WpsClient("1.0.0", httpClient));

    }

}