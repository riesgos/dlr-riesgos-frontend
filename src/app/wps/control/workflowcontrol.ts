import {Graph, alg} from 'graphlib';
import { WpsData, WpsDataDescription, ProductId, WpsClient, WpsVerion } from 'projects/services-wps/src/public_api';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserconfigurableWpsDataDescription, isUserconfigurableWpsDataDescription } from 'src/app/components/config_wizard/userconfigurable_wpsdata';
import { ActivatedRoute } from '@angular/router';
import { EqEventCatalogue } from '../configuration/chile/eqEventCatalogue';
import { EqGroundMotion } from '../configuration/chile/eqGroundMotion';
import { EqTsInteraction } from '../configuration/chile/eqTsInteraction';
import { TsPhysicalSimulation } from '../configuration/chile/tsPhysicalSimulation';
import { HttpClient } from '@angular/common/http';
import { ProcessId, Process, Product, ProcessState } from './workflow_datatypes';




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

    private processes: Map<ProcessId, Process>;  // @TODO: would it be better to make these observables? Should WFC get access to Store?
    private products: Map<ProductId, Product>;   // @TODO: would it be better to make these observables? Should WFC get access to Store?
    private graph: Graph;
    private wpsClient: WpsClient;


    constructor(
        httpClient: HttpClient) {

        this.wpsClient = new WpsClient("1.0.0", httpClient);
        this.processes = new Map<ProcessId, Process>();
        this.products = new Map<ProductId, Product>();
        const processes: Process[] = [EqEventCatalogue, EqGroundMotion, EqTsInteraction, TsPhysicalSimulation];

        // Step 1: creating graph
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

        // Step 2: storing data
        for (let process of this.getProcessesInExecutionOrder(processes)) {
            this.processes.set(process.id, process);
            for (let productDescription of process.requiredProducts) {
                this.products.set(productDescription.id, {
                    description: productDescription,
                    value: null
                });
            }
            const providedProdDescr = process.providedProduct;
            this.products.set(providedProdDescr.id, {
                description: providedProdDescr,
                value: null
            });
        }
    }


    getProcesses(): Map<ProcessId, Process> {
        this.updateAllStates();
        return this.processes; 
    }


    getProducts(): Map<ProductId, Product> {
        return this.products;
    }


    executeProcess(processId: ProcessId, tapFunction?: ((response: any) => void) ): Observable<boolean> {

        this.updateState(processId);
        const process = this.getProcess(processId);
        if(process.state != ProcessState.available) throw new Error(`Process ${processId} is currently not available for execution`);

        const inputs = this.getInputsAsWpsData(processId);
        const outputDescription = process.providedProduct;

        this.setState(processId, ProcessState.runing);
        return this.wpsClient.executeAsync(process.url, process.id, inputs, outputDescription, 500, tapFunction).pipe(
            tap((results: WpsData[]) => {
                for(let result of results) {
                    this.provideProductValue(result.id, result.data);
                }
                this.updateAllStates();
            }),
            map((results: WpsData[]) => {return true})
        );
    }


    provideProductValue(productId: ProductId, value: any): void {
        const product = this.getProduct(productId);
        const newProduct = {
            description: product.description, 
            value: value
        };
        this.products.set(productId, newProduct);
    }


    private setState(id: ProcessId, state: ProcessState): void {
        const process = this.getProcess(id);
        const newProcess = {
            ...process, 
            state: state
        }
        this.processes.set(id, newProcess);
    }

    private updateAllStates(): void {
        this.processes.forEach((_, k) => {
            this.updateState(k);
        })
    }

    private updateState(id: ProcessId): void {
        const process = this.getProcess(id);
        const newProcess = {
            ...process, 
            state: this.calculateState(id)
        };
        this.processes.set(id, newProcess);
    }

    private calculateState(id: ProcessId): ProcessState {
        // @TODO: other states: running, error

        const process = this.getProcess(id);

        // is any non-user-input missing? -> unavailable
        for(let productDescr of process.requiredProducts) {
            if(!isUserconfigurableWpsDataDescription(productDescr)) {
                const product = this.getProduct(productDescr.id);
                if(!product.value) return ProcessState.unavailable;
            }
        }

        // is the output missing? -> available
        const output = this.getProduct(process.providedProduct.id);
        if(!output.value) return ProcessState.available;

        return ProcessState.completed;
    }


    private getProcess(id: ProcessId): Process {
        const process = this.processes.get(id);
        if (!process) throw new Error(`Unknown process ${id}`);
        return process;
    }

    private getProduct(id: ProductId): Product {
        const product = this.products.get(id);
        if (!product) throw new Error(`Unknown product ${id}`);
        return product;
    }


    private getInputsAsWpsData(id: ProcessId): WpsData[] {
        const process = this.getProcess(id);
        const inputDescrs = process.requiredProducts;
        const inputs: WpsData[] = inputDescrs.map(descr => {
            const product = this.getProduct(descr.id);
            return {
                ...descr,
                data: product.value
            };
        });
        return inputs;
    }


    private getProcessesInExecutionOrder(processes: Process[]): Process[] {
        const allIds = alg.topsort(this.graph);
        const processIds = processes.map(proc => proc.id);
        const sortedProcessIds = allIds.filter(id => processIds.includes(id));
        const sortedProcesses = sortedProcessIds.map(id => processes.find(proc => proc.id == id) );
        return sortedProcesses;
    }

}