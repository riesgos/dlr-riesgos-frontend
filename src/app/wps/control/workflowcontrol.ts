import {Graph, graph_alg} from 'graphlib';
import { WpsData, WpsClient } from 'projects/services-wps/src/public_api';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';



export type Product = WpsData;


export enum ProcessState {
    unavailable = "unavailable",
    available = "available", 
    runing = "running", 
    completed = "completed", 
    error = "error", 
}

export class Process {
    
    private state: ProcessState;

    constructor(
        readonly id: string, 
        readonly url: string, 
        readonly requiredProducts: Product[], 
        readonly providedProduct: Product,
        private wpsClient: WpsClient) {
            this.state = this.calculateState();
        }

        
    public execute(): Observable<Product> {
        if(this.state != ProcessState.available) {
            throw new Error(`Process ${this.id} cannot yet be executed!`);
        }

        this.state = ProcessState.runing;
        return this.wpsClient.executeAsync(this.url, this.id, this.requiredProducts, this.providedProduct).pipe(
            tap(_ => this.state = ProcessState.completed),
            map((results: WpsData[]) => {
                return results[0];
            })
        );
    }

    public requiresProduct(product: Product): boolean {
        return this.requiredProducts
            .map(pr => pr.id)
            .includes(product.id);
    }


    public setProduct(product: Product): void {
        let it = this.requiredProducts
            .find(prod => prod.id == product.id)
        if(it) it.data = product.data;
        this.state = this.calculateState();
    }


    private calculateState(): ProcessState {
        if( this.requiredProducts.find(pr => pr.data === undefined ) ) return ProcessState.unavailable;
        if( this.providedProduct.data ) return ProcessState.completed; 
        return ProcessState.available;
    }
}


export class WorkflowControl {

    readonly processes: Process[]; 
    private graph: Graph;


    constructor(processes: Process[]) {

        this.processes = processes;

        this.graph = new Graph({directed: true});
        for (let process of this.processes) {
            for (let inProd of process.requiredProducts) {
                this.graph.setEdge(inProd.id, process.id);
            }
            let outProd = process.providedProduct;
            this.graph.setEdge(process.id, outProd.id);
        }

        if (!graph_alg.isAcyclic(this.graph)) {
            throw new Error('Process graphs with cycles are not supported');
        }
    }


    provideProduct(product: Product): void {
        this.processes
            .filter(process => process.requiresProduct(product))
            .map(process => process.setProduct(product));
    }


    getProcessesInExecutionOrder(): Process[] {
        const allIds = graph_alg.topsort(this.graph);
        const processIds = this.processes.map(proc => proc.id);
        const sortedProcessIds = allIds.filter(id => processIds.includes(id));
        const sortedProcesses = sortedProcessIds.map(id => this.getProcess(id));
        return sortedProcesses;
    }


    getProcess(id: string): Process | undefined {
        return this.processes.find(proc => proc.id == id);
    }
}