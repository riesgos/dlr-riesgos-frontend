import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { isRiesgosUnresolvedRefProduct, isRiesgosResolvedRefProduct, RiesgosProduct, RiesgosProductResolved, isRiesgosValueProduct } from 'src/app/riesgos/riesgos.state';
import { ConfigService } from '../configService/configService';



interface CacheEntry {
  key: string,
  data: any,
  added: number
};



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private cache: CacheEntry[] = [];

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  resolveReferences(products: RiesgosProduct[]): Observable<RiesgosProductResolved[]> {
    const pendingRequests$ = products.map(p => this.resolveReference(p));
    return forkJoin(pendingRequests$);
  }

  resolveReference(product: RiesgosProduct): Observable<RiesgosProductResolved> {
    if (isRiesgosValueProduct(product) || isRiesgosResolvedRefProduct(product)) {
      return of(product);
    } else if (isRiesgosUnresolvedRefProduct(product)) {
      const link = product.reference;
      const value$ = this.fetchFromLink(link);
      return value$.pipe(
        map(v => {
          const resolvedProduct: RiesgosProductResolved = {
            id: product.id,
            reference: link, // resolved products maintain their reference, so that they can be sent back to the backend easily
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

    const url = this.config.getConfig().middlewareUrl;
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


  private getFromCache(key) {
    const entry = this.cache.find(e => e.key === key);
    if (entry) return entry.data;
  }

  private setOnCache(key, data) {
    this.cache.push({
      key, data, added: new Date().getTime()
    });
    // Forget older cache-entries to save on memory
    if (this.cache.length > 30) {
      this.cache.shift();
    }
  }
}
