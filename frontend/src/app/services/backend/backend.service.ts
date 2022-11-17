import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "../configService/configService";


@Injectable()
export class BackendService {

    constructor(
        private configService: ConfigService,
        private http: HttpClient
    ) {}

    loadMetadata(): Observable<any> {
        throw new Error('Method not implemented.');
    }

    execute(): Observable<any> {
        throw new Error('Method not implemented.');
    }
    
}