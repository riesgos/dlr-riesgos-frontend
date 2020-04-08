import { Cache, WpsData } from '@dlr-eoc/services-ogc';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

/**
 * For security reasons, this class does not access a mongo-server directly.
 * Instead, all requests are forwared to a server, where a node-app has r/w access to the db.
 */
export class RemoteCache implements Cache {

    private remoteUrl = environment.production ? 'http://riesgos/cache' : 'http://localhost:1411/cache';

    constructor(private http: HttpClient) {}

    set(input: object, output: WpsData[]): Observable<boolean> {
        return this.http.post(this.remoteUrl + '/set', {
            input, output
        }).pipe(map((response) => {
            if (response) {
                return true;
            }
            return false;
        }));
    }

    get(input: object): Observable<WpsData[] | null> {
        return this.http.post(this.remoteUrl + '/get', {input}).pipe(map(
            (response) => {
                return null;
            }
        ));
    }
}
