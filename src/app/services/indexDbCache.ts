import { Cache } from '@dlr-eoc/services-ogc';
import { set, get, del } from 'idb-keyval';
import { Observable, from } from 'rxjs';
import md5 from 'md5';


interface Entry {
    data: string;
    created: Date;
}

export class IndexDbCache implements Cache {

    private maxCacheAge = 24 * 60 * 60 * 1000;

    set(input: any, output: any): Observable<any> {
        const key = md5(JSON.stringify(input));
        const entry: Entry = {
            data: JSON.stringify(output),
            created: new Date()
        };
        const request$ = set(key, entry).then(() => {
            return true;
        });
        return from(request$);
    }

    get(input: any): Observable<any> {
        const key = md5(JSON.stringify(input));
        const request$ = get(key).then((entry: Entry | undefined) => {
            if (entry) {
                const delta = new Date().getTime() - entry.created.getTime();
                if (delta > this.maxCacheAge) {
                    return JSON.parse(entry.data);
                } else {
                    del(key);
                    return null;
                }
            } else {
                return null;
            }
        });
        return from(request$);
    }
}
