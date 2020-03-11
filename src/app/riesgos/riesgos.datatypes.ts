import { WpsDataDescription, WpsVerion, ProductId, WpsData, WpsClient, FakeCache, Cache } from '@ukis/services-ogc';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { RemoteCache } from '../services/remoteCache';
import { IndexDbCache } from '../services/indexDbCache';
import { environment } from 'src/environments/environment';


export type ProductDescription = object;

export interface Product {
    readonly uid: string;
    readonly description: ProductDescription;
    readonly value: any;
}


export type ProcessId = string;


export enum ProcessStateTypes {
    unavailable = 'unavailable',
    available = 'available',
    running = 'running',
    completed = 'completed',
    error = 'error',
}

export class ProcessStateUnavailable {
    type: string = ProcessStateTypes.unavailable;
}


export class ProcessStateAvailable {
    type: string = ProcessStateTypes.available;
}


export class ProcessStateRunning {
    type: string = ProcessStateTypes.running;
}


export class ProcessStateCompleted {
    type: string = ProcessStateTypes.completed;
}


export class ProcessStateError {
    type: string = ProcessStateTypes.error;
    constructor(public message: string) {}
}

export type ProcessState = ProcessStateUnavailable | ProcessStateAvailable |
ProcessStateRunning | ProcessStateCompleted | ProcessStateError;


export interface ImmutableProcess {
    readonly uid: ProcessId;
    readonly name: string;
    readonly requiredProducts: ProductId[];
    readonly providedProducts: ProductId[];
    readonly state: ProcessState;
    description?: string;
}
export interface Process extends ImmutableProcess {
    state: ProcessState;
}


export const isImmutableProcess = (o: any): o is ImmutableProcess => {
    return o.hasOwnProperty('uid') &&  o.hasOwnProperty('requiredProducts') &&  o.hasOwnProperty('providedProduct');
};



export interface ExecutableProcess extends Process {
    execute(
        inputs: Product[],
        outputs?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void):
        Observable<Product[]>;
}

export const isExecutableProcess = (p: Process): p is ExecutableProcess => {
    return  (typeof p['execute'] === 'function');
};


export interface ProductTransformingProcess extends Process {
    onProductAdded(newProduct: Product, allProducts: Product[]): Product[];
}


export const isProductTransformingProcess = (process: Process): process is ProductTransformingProcess => {
    return process.hasOwnProperty('onProductAdded');
};


export class WpsProcess implements ExecutableProcess {

    private wpsClient: WpsClient;

    constructor(
        readonly uid: string,
        readonly name: string,
        readonly requiredProducts: string[],
        readonly providedProducts: string[],
        readonly id: string,
        readonly description: string,
        readonly url: string,
        readonly wpsVersion: WpsVerion,
        httpClient: HttpClient,
        public state = new ProcessStateUnavailable(),
        cache: Cache = environment.production ? new FakeCache() : new IndexDbCache()
        ) {
        this.wpsClient = new WpsClient(this.wpsVersion, httpClient, cache);
    }

    public execute(
        inputProducts: Product[],
        outputProducts?: Product[],
        doWhileExecuting?: (response: any, counter: number) => void): Observable<Product[]> {

            const wpsInputs = inputProducts.map(prod => this.prodToWpsData(prod));
            const wpsOutputDescriptions = outputProducts.map(o => o.description) as WpsDataDescription[];

            let requestCounter = 0;
            return this.wpsClient.executeAsync(this.url, this.id, wpsInputs, wpsOutputDescriptions, 2000,
                (response: any) => {
                    if (doWhileExecuting) {
                        doWhileExecuting(response, requestCounter);
                    }
                    requestCounter += 1;
                }
            ).pipe(

                map((outputs: WpsData[]) => {
                    // Ugly little hack: if outputDescription contained any information that has been lost in translation
                    // through marshalling and unmarshalling, we add it here back in.
                    for (let i = 0; i < outputs.length; i++) {
                        const outputDescription = wpsOutputDescriptions[i];
                        const output = outputs[i];
                        for (const key in outputDescription) {
                            if (!output.description.hasOwnProperty(key)) {
                                output.description[key] = outputDescription[key];
                            }
                        }
                    }

                    const products = this.assignWpsDataToProducts(outputs, outputProducts as (Product & WpsData)[]);
                    return products;
                }),

                catchError((error) => {
                    console.error(error);
                    return throwError(error);
                })
            );

    }

    public setCache(cache: Cache) {
        this.wpsClient.setCache(cache);
    }

    private assignWpsDataToProducts(wpsData: WpsData[], initialProds: (Product & WpsData)[]): Product[] {
        const out: Product[] = [];

        for (const prod of initialProds) {
            const equivalentWpsData = wpsData.find(data => {
                return (
                    data.description.id === prod.description.id &&
                    // data.description.format === prod.description.format && // <- not ok? format can change from 'wms' to 'string', like in service-ts!
                    data.description.reference === prod.description.reference &&
                    data.description.type === prod.description.type
                );
            });

            if (equivalentWpsData) {
                out.push({
                    ...equivalentWpsData,
                    uid: prod.uid
                });
            }

        }

        return out;
    }

    private prodToWpsData(product: Product): (Product & WpsData) {
        // @TODO
        return product as (Product & WpsData);
    }
}

export const isWpsProcess = (p: Process): p is WpsProcess => {
    return p.hasOwnProperty('url') && p.hasOwnProperty('state') && p.hasOwnProperty('wpsVersion');
};
