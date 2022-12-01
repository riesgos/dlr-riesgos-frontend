import { XhrFactory } from "@angular/common";
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { ConfigService } from "../configService/configService";
import { BackendService, API_ScenarioState } from "./backend.service";




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
        proxyUrl: "",
        allowedScenarios: []
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
            expect(scenarios).toBeTruthy();
            expect(scenarios.length).toBeTruthy();
            expect(scenarios[0].id).toBeTruthy();
            expect(scenarios[0].description).toBeTruthy();
            expect(scenarios[0].steps.length).toBeTruthy();
            expect(scenarios[0].steps[0].id).toBeTruthy();
            done();
        });
    });

    it('should run steps', (done) => {
        const data: API_ScenarioState = { data: [] };
        backendService.execute('Peru', 'Eqs', data).subscribe(newState => {
            expect(newState).toBeTruthy();
            expect(newState.data).toBeTruthy();
            expect(newState.data[0].id).toBeTruthy();
            done();
        })
    });

    it('should get meta-data -- async', async () => {
        const scenarios = await backendService.asyncLoadScenarios();
        expect(scenarios).toBeTruthy();
        expect(scenarios.length).toBeTruthy();
        expect(scenarios[0].id).toBeTruthy();
        expect(scenarios[0].description).toBeTruthy();
        expect(scenarios[0].steps.length).toBeTruthy();
        expect(scenarios[0].steps[0].id).toBeTruthy();
    });

    it('should run steps -- async', async () => {
        const data: API_ScenarioState = { data: [] };
        const newState = await backendService.asyncExecute('Peru', 'Eqs', data);
        expect(newState).toBeTruthy();
        expect(newState.data).toBeTruthy();
        expect(newState.data[0].id).toBeTruthy();
    });
});