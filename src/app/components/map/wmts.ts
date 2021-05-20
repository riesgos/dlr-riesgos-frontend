import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import TileLayer from 'ol/layer/Tile';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Injectable()
export class WMTSLayerFactory {
    constructor(private http: HttpClient) {}

    createWmtsLayer(serverUrl: string, layerName: string, matrixSet: string): Observable<TileLayer> {
        return this.getWMTSCapabilities(serverUrl).pipe(
            map(r => {
                const options = this.capabilitiesToOptions(r, layerName, matrixSet);
                const layer = this.layerFromOptions(options);
                return layer;
            })
        );
    }

    layerFromOptions(options): TileLayer {
        return new TileLayer({
            source: new WMTS({
                ...options,
                crossOrigin: 'anonymous'
            })
        });
    }

    capabilitiesToOptions(capabilities, layer: string, matrixSet: string) {
        return optionsFromCapabilities(capabilities, {layer, matrixSet});
    }

    getWMTSCapabilities(serverUrl: string) {
        const capabilitiesUrl = serverUrl + '?service=WMTS&request=GetCapabilities';
        return this.http.get(capabilitiesUrl, {
            headers: {
                'Accept': 'text/xml, application/xml'
            },
            responseType: 'text'
        }).pipe(
            map(result => {
                return new WMTSCapabilities().read(result);
            })
        );
    }
}