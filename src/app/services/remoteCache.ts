import { Cache, WpsData } from '@dlr-eoc/services-ogc';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';


export class RemoteCache implements Cache {

    constructor(
        private http: HttpClient,
        private remoteUrl: string
    ) {}

    set(input: object, output: WpsData[]): Observable<boolean> {
        return this.http.post(this.remoteUrl + '/set', {
            input, output
        }).pipe(map((response) => {
            if (response) {
                return true;
            }
            return false;
        }), catchError((err) => {
            return of(false);
        }));
    }

    get(input: object): Observable<any | null> {
        return this.http.post(this.remoteUrl + '/get', {input}).pipe(map(
            (response) => {
                if (response) {
                    return response[0];
                } else {
                    return null;
                }
            }
        ), catchError((err) => {
            return of(null);
        }));
    }
}
