import { Cache, } from '@ukis/services-ogc';
import { openDB } from 'idb';
import { Observable, from } from 'rxjs';
import md5 from 'md5';


export class IndexDbCache implements Cache {

    private version = 1;
    private dbName = 'riesgos';
    private storeName = 'cache';

    set(input: any, output: any): Observable<any> {
        const data = {
            key: md5(input),
            data: output,
            created: new Date()
        };

        const request$ = openDB(this.dbName, this.version).then(db => {
            const store = db.transaction(this.storeName).objectStore(this.storeName);
            return store.add(data);
        });

        return from(request$);
    }

    get(input: any): Observable<any> {
        const key = md5(input);
        const request$ = openDB(this.dbName, this.version).then(db => {
            const store = db.transaction(this.storeName).objectStore(this.storeName);
            return store.get(key);
        });
        return from(request$);
    }
}