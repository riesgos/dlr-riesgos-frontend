import { XhrFactory } from "@angular/common";
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ConfigService } from "../configService/configService";
import { BackendService } from "./backend.service";




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


describe('Testing backend service', () => {

    let service: BackendService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HttpClient,
                    useClass: TestHttpClient
                }, {
                    multi: true,
                    provide: APP_INITIALIZER,
                    deps: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        return () => configService.loadConfig();
                    }
                },
                BackendService
            ],
        });
        service = TestBed.inject(BackendService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('should get meta-data', () => {

    // });

    // it('should run steps', () => {

    // });

});