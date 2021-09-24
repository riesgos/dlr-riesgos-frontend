import { WpsProcess, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { Cache } from '@dlr-eoc/utils-ogc';


export class Volcanus extends WpsProcess {

    constructor(http: HttpClient, cache: Cache) {
        super(
            'volcanus',
            'Volcanus',
            [],
            [],
            'org.n52.gfz.riesgos.algorithm.impl.VolcanusProcess',
            '',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
    }

}
