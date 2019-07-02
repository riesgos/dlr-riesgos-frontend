import { Process, Product, ProcessId, ProcessState } from './wps.datatypes';
import { Graph, alg } from 'graphlib';
import { ProductId, WpsData } from 'projects/services-wps/src/lib/wps_datatypes';
import { WpsClient } from 'projects/services-wps/src/public_api';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { isUserconfigurableWpsDataDescription, isUserconfigurableWpsData } from '../components/config_wizard/userconfigurable_wpsdata';


export class WorkflowControl {

    private processes: Process[];
    private products: Product[];
    private graph: Graph;
    private wpsClient: WpsClient

    constructor(processes: Process[], products: Product[], httpClient: HttpClient) {

        this.wpsClient = new WpsClient("1.0.0", httpClient);

        this.graph = new Graph({ directed: true });
        for (let process of processes) {
            for (let inProd of process.requiredProducts) {
                this.graph.setEdge(inProd.id, process.id);
            }
            let outProd = process.providedProduct;
            this.graph.setEdge(process.id, outProd.id);
        }

        if (!alg.isAcyclic(this.graph)) {
            throw new Error('Process graphs with cycles are not supported');
        }

        this.products = products;
        this.processes = this.getProcessesInExecutionOrder(processes);
        this.processes = this.processes.map(p => {return {
            ...p,
            state: this.calculateState(p.id)
        }});
        
    }

    execute(id: ProcessId, doWhileRequesting?: (response: any, counter: number) => void): Observable<boolean> {

        let process = this.getProcess(id);
        let inputs = this.getProcessInputs(id);
        let outputDescription = process.providedProduct;
    
        process = this.setProcessState(process.id, ProcessState.running);
        let requestCounter = 0;
        return this.wpsClient.executeAsync(process.url, process.id, inputs, outputDescription, 1000, 
            
            (response: any) => {
                if(doWhileRequesting) doWhileRequesting(response, requestCounter);
                requestCounter += 1;
            }

        ).pipe(

            map((output: WpsData[]) => {
                // Ugly little hack: if outputDescription contained any information that has been lost in translation through marshalling and unmarshalling, we add it here back in. 
                for(let key in outputDescription) {
                    if(!output[0].description.hasOwnProperty(key)) {
                        output[0].description[key] = outputDescription[key];
                    }
                }
                return output;
            }), 

            tap((output: WpsData[]) => {
                for(let product of output) {
                    this.provideProduct(product.description.id, product.value);
                }
                this.setProcessState(process.id, ProcessState.completed)
            }),

            catchError((error) => {
                this.setProcessState(process.id, ProcessState.error);
                return of(error);
            }), 

            map((output: WpsData[]) => {
                return true
            })
        );

    }


    getProcesses(): Process[] {
        return this.processes;
    }


    getProducts(): Product[] {
        return this.products;
    }


    provideProduct(id: ProductId, value: any): void {

        // set new value
        this.setProductValue(id, value);

        // update state of all downstream provesses
        const inputEdges = this.graph.outEdges(id);
        for(let inputEdge of inputEdges) {
            const processId = inputEdge.w;
            this.setProcessState(processId, this.calculateState(processId));
        }
    }


    invalidateProcess(id: ProcessId): void {

        const outputEdges = this.graph.outEdges(id);
        for(let outputEdge of outputEdges) {
            const productId = outputEdge.w;
            this.setProductValue(productId, null);
            
            const nextInputEdges = this.graph.outEdges(productId);
            for(let nextInputEdge of nextInputEdges) {
                const processId = nextInputEdge.w;
                this.invalidateProcess(processId);
            }
        }
        this.setProcessState(id, this.calculateState(id));

    }


    private getProcessInputs(id: ProcessId): Product[] {
        const process = this.getProcess(id);
        const ids = process.requiredProducts.map(p => p.id);
        const products = ids.map(id => this.getProduct(id));
        return products; 
    }


    private getProcess(id: ProcessId): Process {
        const process = this.processes.find(p => p.id == id);
        if(!process) throw new Error(`no such process: ${id}`);
        return process;
    }


    private getProduct(id: ProductId): Product {
        const product = this.products.find(p => p.description.id == id);
        if(!product) throw new Error(`no such product: ${id}`);
        return product;
    }


    private setProcessState(id: ProcessId, state: ProcessState): Process {
        this.processes = this.processes.map(process => {
            if(process.id == id) return {
                ...process, 
                state: state
            };
            return process;
        });
        return this.getProcess(id);
    }


    private setProductValue(id: ProductId, value: any): Product {
        this.products = this.products.map(product => {
            if(product.description.id == id) return {
                ...product, 
                value: value
            };
            return product;
        });
        return this.getProduct(id);
    }


    private getProcessesInExecutionOrder(processes: Process[]): Process[] {
        const allIds = alg.topsort(this.graph);
        const processIds = processes.map(proc => proc.id);
        const sortedProcessIds = allIds.filter(id => processIds.includes(id));
        const sortedProcesses = sortedProcessIds.map(id => processes.find(proc => proc.id == id) );
        return sortedProcesses;
    }


    private calculateState(id: ProcessId): ProcessState {

        const process = this.getProcess(id);

        // currently running?
        if(process.state == ProcessState.running) return ProcessState.running;

        // is the output there? -> complete
        const output = this.getProduct(process.providedProduct.id);
        if(output.value) return ProcessState.completed;

        // is any non-user-input missing? -> unavailable
        for(let productDescr of process.requiredProducts) {
            const product = this.getProduct(productDescr.id);
            if(!isUserconfigurableWpsData(product) && !product.value) return ProcessState.unavailable;
        }

        return ProcessState.available;
    }

}