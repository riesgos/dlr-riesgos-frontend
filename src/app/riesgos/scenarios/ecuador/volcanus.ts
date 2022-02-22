import { WpsProcess, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { Cache } from 'src/app/services/wps';


export class Volcanus extends WpsProcess {

    constructor(http: HttpClient, cache: Cache) {
        super(
            'volcanus',
            'Volcanus',
            [],
            [],
            'org.n52.gfz.riesgos.algorithm.impl.VolcanusProcess',
            '',
            'https://rz-vm140.gfz-potsdam.de:8443/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
    }

}
