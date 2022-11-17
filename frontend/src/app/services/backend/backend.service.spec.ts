import { XhrFactory } from "@angular/common";
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { switchMap } from "rxjs/operators";
import { ConfigService } from "../configService/configService";
import { BackendService, Datum, DatumReference, ScenarioState } from "./backend.service";




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

class MockConfigService extends ConfigService {
    protected config = {
        production: false,
        middlewareUrl: "http://localhost:1411",
        useProxy: false,
        proxyUrl: "",
        gfzUseStaging: false
    }
}


describe('Testing backend service', () => {

    const configService = new MockConfigService();
    const httpService = new TestHttpClient();
    const backendService = new BackendService(configService, httpService);

    

    it('should be created', () => {
        expect(backendService).toBeTruthy();
    });

    it('should get meta-data', (done) => {
        backendService.loadScenarios().subscribe(scenarios => {
            expect(scenarios);
            expect(scenarios.length);
            expect(scenarios[0].id);
            expect(scenarios[0].description);
            expect(scenarios[0].steps.length);
            expect(scenarios[0].steps[0].id);
            done();
        });
    });

    it('should run steps', (done) => {
        const data: ScenarioState = { data: [] };
        backendService.execute('Peru', 'Eqs', data).subscribe(newState => {
            expect(newState);
            expect(newState.data);
            expect(newState.data[0].id);
            done();
        })
    });

});