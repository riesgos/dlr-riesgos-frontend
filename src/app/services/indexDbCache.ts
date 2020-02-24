import { Cache, } from '@ukis/services-ogc';
import { set, get } from 'idb-keyval';
import { Observable, from } from 'rxjs';
import md5 from 'md5';


interface Entry {
    data: string;
    created: Date;
}

export class IndexDbCache implements Cache {

    set(input: any, output: any): Observable<any> {
        const key = md5(JSON.stringify(input));
        const entry: Entry = {
            data: JSON.stringify(output),
            created: new Date()
        };
        const request$ = set(key, entry).then(() => {
            console.log('Stored data in cache for key', key);
            return true;
        });
        return from(request$);
    }

    get(input: any): Observable<any> {
        const key = md5(JSON.stringify(input));
        const request$ = get(key).then((entry: Entry | undefined) => {
            if (entry) {
                console.log('found entry in cache for key', key);
                return JSON.parse(entry.data);
            } else {
                console.log('no entry in cache for key', key);
                return null;
            }
        });
        return from(request$);
    }
}