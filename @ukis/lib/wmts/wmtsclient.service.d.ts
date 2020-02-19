import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export declare class WmtsClientService {
    private http;
    private xmlmarshaller;
    private xmlunmarshaller;
    constructor(http: HttpClient);
    getCapabilities(url: string, version?: string): Observable<object>;
}
