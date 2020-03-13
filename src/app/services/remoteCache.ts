import { Cache, WpsData } from '@dlr-eoc/services-ogc';
import { Observable, of } from 'rxjs';


export class RemoteCache implements Cache {

    set(input: object, output: WpsData[]): Observable<boolean> {
        return of(false);
    }

    get(input: object): Observable<WpsData[] | null> {
        return of(null);
    }
}
