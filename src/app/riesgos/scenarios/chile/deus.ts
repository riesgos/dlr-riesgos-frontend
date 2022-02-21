import { WpsProcess, ProcessStateUnavailable } from 'src/app/riesgos/riesgos.datatypes';
import { HttpClient } from '@angular/common/http';
import { Cache } from 'src/app/services/wps';



export class Deus extends WpsProcess {
    constructor(http: HttpClient, cache: Cache) {
        super(
            'deus',
            'DEUS',
            ['intensity', 'exposure', 'schema', 'fragility'],
            ['updated_exposure', 'transition', 'damage'],
            'org.n52.gfz.riesgos.algorithm.impl.DeusProcess',
            'This service returns damage caused by the selected earthquake.',
            'http://rz-vm140.gfz-potsdam.de:8080/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable(),
            cache
        );
    }
}
