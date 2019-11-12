import { WpsProcess, ProcessStateUnavailable } from 'src/app/wps/wps.datatypes';
import { HttpClient } from '@angular/common/http';




export class Deus extends WpsProcess {
    constructor(http: HttpClient) {
        super(
            'deus',
            'DEUS',
            ['intensity', 'exposure', 'schema', 'fragility'],
            ['updated_exposure', 'transition', 'damage'],
            'org.n52.gfz.riesgos.algorithm.impl.DeusProcess',
            'This service outputs damage caused by the selected earthquake.',
            'http://rz-vm140.gfz-potsdam.de/wps/WebProcessingService',
            '1.0.0',
            http,
            new ProcessStateUnavailable()
        );
    }
}