import { WpsProcess, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class Volcanus extends WpsProcess {

    constructor(http: HttpClient, middleWareUrl: string) {
        super(
            'volcanus',
            'Volcanus',
            [],
            [],
            'org.n52.gfz.riesgos.algorithm.impl.VolcanusProcess',
            '',
            `https://rz-vm140.gfz-potsdam.de/wps/WebProcessingService`,
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            middleWareUrl
        );
    }

}
