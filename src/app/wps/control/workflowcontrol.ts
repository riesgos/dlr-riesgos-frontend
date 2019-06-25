import {Graph, alg} from 'graphlib';
import { WpsData } from 'projects/services-wps/src/public_api';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Process, Product, ProcessId } from './process';
import { WpsConfigurationProvider } from '../configuration/configurationProvider';



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




@Injectable()
export class WorkflowControl {

    readonly processes: Process[]; 
    private graph: Graph;


    constructor(configurationProvider: WpsConfigurationProvider) {

        const processes: Process[] = configurationProvider.createProcesses();

        this.graph = new Graph({directed: true});
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
    
    
    getProcess(id: ProcessId): Process | undefined {
        return this.processes.find(proc => proc.id == id);
    }


    private getProcessesInExecutionOrder(processes: Process[]): Process[] {
        const allIds = alg.topsort(this.graph);
        const processIds = processes.map(proc => proc.id);
        const sortedProcessIds = allIds.filter(id => processIds.includes(id));
        const sortedProcesses = sortedProcessIds.map(id => processes.find(proc => proc.id == id) );
        return sortedProcesses;
    }
}