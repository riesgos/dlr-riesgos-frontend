import { Injectable } from '@angular/core';
import { Reader, getLayer, getStyle, createOlStyleFunction } from '@nieuwlandgeo/sldreader';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SldParserService {

    constructor(
        private httpClient: HttpClient
    ) { }

    readStyleForLayer(fileUrl: string, layerName: string): Observable<any> {

        const headers = new HttpHeaders({
            'Content-Type': 'text/xml',
            'Accept': 'text/xml, application/xml'
        });

        return this.httpClient.get(fileUrl, { headers: headers, responseType: 'text' }).pipe(
            map((result) => {
                const sldObject = Reader(result);
                const sldLayer = getLayer(sldObject);
                const style = getStyle(sldLayer, layerName);
                const featureTypeStyle = style.featuretypestyles[0];
                const styleFunction = createOlStyleFunction(featureTypeStyle, {
                    // in this object we may define a few additional hooks to help the stylefunction interact with the actual layer.
                });
                return styleFunction;
            })
        );
    }
}
