import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { XhrFactory } from '@angular/common';
import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { effects, reducers } from '../ngrx_register';
import { RiesgosService } from './riesgos.service';
import { WorkflowControl } from './riesgos.workflowcontrol';
import { ErrorParserService } from '../services/errorParser/error-parser.service';


class MyXhrFactory extends XhrFactory {
    build(): XMLHttpRequest {
        return new XMLHttpRequest();
    }
}


class TestHttpClient extends HttpClient {
    constructor() {
        super(new HttpXhrBackend(new MyXhrFactory()));
    }
}


describe('Integration tests for riesgos scenarios', () => {


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useClass: TestHttpClient }
            ],
            imports: [
                StoreModule.forRoot(reducers),
                EffectsModule.forRoot(effects),
            ],
        });
    });


    const riesgosService = new RiesgosService(new TestHttpClient());
    const metadata = riesgosService.loadScenarioMetadata();
    const scenarios = metadata.map(md => md.id);

    for (const scenario of scenarios) {
        const [freshProcesses, freshProducts] = riesgosService.loadScenarioData(scenario);

        const wfc = new WorkflowControl(freshProcesses, freshProducts, new ErrorParserService());
        const processes = wfc.getImmutableProcesses();

        // for (const process of processes) {
        //     it(`scenario ${scenario}: process ${process.uid} should work as expected`, (done) => {

        //         const inputs = wfc.getProcessInputs(process.uid);
        //         for (const input of inputs) {
        //             if (!input.value) {
        //                 if (input.description.hasOwnProperty('defaultValue')) {
        //                     // @ts-ignore
        //                     wfc.provideProduct(input.uid, input.description.defaultValue);
        //                 } else {
        //                     throw new Error(`Could not get a value for product ${input.uid}!`);
        //                 }
        //             }
        //         }

        //         wfc.execute(process.uid).subscribe(results => {
        //             console.log(`executed ${process.uid}.`);
        //             done();
        //         });
        //     });
        // }
    }
});
