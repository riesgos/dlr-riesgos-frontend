import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '../../../http_client/http_client';
import { Cache, FakeCache } from '../../../wps/lib/cache';
import { WpsClient } from '../../../wps/lib/wpsclient';
import { WpsData, WpsVersion } from '../../../wps/lib/wps_datatypes';
import { RiesgosProduct, ExecutableProcess, RiesgosProcess } from '../riesgos.datatypes';


export interface WpsRiesgosProduct extends RiesgosProduct {
    value: WpsData;
}

export interface WpsProcess extends RiesgosProcess {
    serverUrl: string;
    wpsProcessId: string;
    wpsVersion: WpsVersion;
}

export class ExecutableWpsProcess implements ExecutableProcess {

    private wpsClient: WpsClient;
    private serverUrl: string;
    private wpsProcessId: string;

    constructor(processInfo: WpsProcess, httpClient: HttpClient) {
        this.serverUrl = processInfo.serverUrl;
        this.wpsProcessId = processInfo.wpsProcessId;
        const cache = new FakeCache();
        this.wpsClient = new WpsClient(processInfo.wpsVersion, httpClient, cache);
    }


    public execute(
        inputProducts: { [slot: string]: WpsRiesgosProduct },
        outputProducts: { [slot: string]: WpsRiesgosProduct }): Observable<{ [slot: string]: WpsRiesgosProduct }> {

        const wpsInputs = Object.values(inputProducts).map(prod => prod.value.value);
        const wpsOutputDescriptions = Object.values(outputProducts).map(prod => prod.value.value.description);

        return this.wpsClient.executeAsync(this.serverUrl, this.wpsProcessId, wpsInputs, wpsOutputDescriptions, 2000).pipe(
            map((outputs: WpsData[]) => {
                const outputProductsWithValues: { [slot: string]: WpsRiesgosProduct } = {};
                for (const output of outputs) {
                    const slot = this.getSlot(outputProducts, output);
                    const associatedProduct = outputProducts[slot];
                    outputProductsWithValues[slot] = {
                        ...associatedProduct,
                        value: output
                    };
                }
                return outputProductsWithValues;
            })
        );
    }

    private getSlot(products: { [slot: string]: WpsRiesgosProduct }, output: WpsData) {
        for (const key in products) {
            const product = products[key];
            if (output.description.id === product.value.description.id) {
                return key;
            }
        }
        throw Error(`Could not find RiesgosProduct for WPS-result ${output.description.id}`);
    }

}

