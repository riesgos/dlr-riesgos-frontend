import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { defaultIfEmpty, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { API_Datum, API_DatumReference, isApiDatum } from './backend.service';



interface CacheEntry {
  key: string,
  data: any,
  added: number
};



@Injectable({
  providedIn: 'root'
})
export class ResolverService {

  private cache: CacheEntry[] = [];

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  resolveReferences(products: (API_Datum | API_DatumReference)[]): Observable<API_Datum[]> {
    const pendingRequests$ = products.map(p => this.resolveReference(p));
    return forkJoin(pendingRequests$).pipe(defaultIfEmpty([]));   // observable won't fire without defaultIfEmpty
  }

  resolveReference(product: API_Datum | API_DatumReference): Observable<API_Datum> {
    if (isApiDatum(product)) {
      return of(product);
    } else {
      const link = product.reference;
      const value$ = this.fetchFromLink(link);
      return value$.pipe(
        map(v => {
          const resolvedProduct: API_Datum = {
            id: product.id,
            value: v
          };
          return resolvedProduct;
        })
      );
    }
  }

  private fetchFromLink(link: string): Observable<any> {
    const cachedData = this.getFromCache(link);
    if (cachedData) return of(cachedData);

    const url = this.config.getConfig().backendUrl;
    return this.http.get(`${url}/files/${link}`, {
      responseType: 'text'
    }).pipe(
      map(data => {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch {
          parsedData = data;
        }
        return parsedData;
      }),
      tap(data => this.setOnCache(link, data))
    );
  }


  private getFromCache(key: string) {
    const entry = this.cache.find(e => e.key === key);
    if (entry) return entry.data;
  }

  private setOnCache(key: string, data: any) {
    this.cache.push({
      key, data, added: new Date().getTime()
    });
    // Forget older cache-entries to save on memory
    if (this.cache.length > 30) {
      this.cache.shift();
    }
  }
}
