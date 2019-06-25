import {Graph, graph_alg} from 'graphlib';
import { WpsData, WpsClient } from 'projects/services-wps/src/public_api';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { EqEventCatalogue } from '../EqEventCatalogue/eqEventCatalogue';
import { EqGroundMotion } from '../EqGroundMotion/eqGroundMotion';
import { EqTsInteraction } from '../EqTsInteraction/eqTsInteraction';
import { TsPhysicalSimulation } from '../TsPhysicalSimulation/tsPhysicalSimulation';
import { HttpClient } from '@angular/common/http';



/**
 * The process/product model is a special case of a bipartite graph. 
 * 
 * G: node
 *      N = Prods U Procs
 *      E = Inputs U Outputs
 * Also:
 *      Prods = Prods_used U Prods_unused
 * 
 * Here we enforce that every process has exactly one  output. 
 *      #Outputs = #Procs
 * 
 * Define multiusage as the number of times products are used in more than one process. 
 * As a consequence of Eulers theorem we then get: 
 *  #loops = #multiusage - #Prods_unused + 1
 */


export type Product = WpsData;


export type ProcessId = string;


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
        readonly id: ProcessId, 
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

    public getState(): ProcessState {
        return this.state;
    }


    private calculateState(): ProcessState {
        if( this.requiredProducts.find(pr => pr.data === undefined ) ) return ProcessState.unavailable;
        if( this.providedProduct.data ) return ProcessState.completed; 
        return ProcessState.available;
    }
}

@Injectable()
export class WorkflowControl {

    readonly processes: Process[]; 
    private graph: Graph;


    constructor(httpClient: HttpClient) {

        const processes = [
            new EqEventCatalogue(httpClient), 
            new EqGroundMotion(httpClient), 
            new EqTsInteraction(httpClient), 
            new TsPhysicalSimulation(httpClient)
        ]

        this.graph = new Graph({directed: true});
        for (let process of processes) {
            for (let inProd of process.requiredProducts) {
                this.graph.setEdge(inProd.id, process.id);
            }
            let outProd = process.providedProduct;
            this.graph.setEdge(process.id, outProd.id);
        }

        if (!graph_alg.isAcyclic(this.graph)) {
            throw new Error('Process graphs with cycles are not supported');
        }

        this.processes = this.getProcessesInExecutionOrder(processes);
    }

    executeProcess(process: Process): Observable<boolean> {
        return process.execute().pipe(
            tap((result: WpsData) => {this.provideProduct(result)}),
            map((result: WpsData) => {return true})
        )
    }


    provideProduct(product: Product): void {
        this.processes
            .filter(process => process.requiresProduct(product))
            .map(process => process.setProduct(product));
    }

    
    getProcesses() {
        throw new Error("Method not implemented.");
    }
    
    
    getProcess(id: ProcessId): Process | undefined {
        return this.processes.find(proc => proc.id == id);
    }


    private getProcessesInExecutionOrder(processes: Process[]): Process[] {
        const allIds = graph_alg.topsort(this.graph);
        const processIds = processes.map(proc => proc.id);
        const sortedProcessIds = allIds.filter(id => processIds.includes(id));
        const sortedProcesses = sortedProcessIds.map(id => processes.find(proc => proc.id == id) );
        return sortedProcesses;
    }
}