import { Process, Product, ProcessId, ProcessState } from './wps.datatypes';
import { Graph, graph_alg } from 'graphlib';
import { ProductId } from 'projects/services-wps/src/lib/wps_datatypes';


export class WorkflowControl {

    private graph: Graph;
    constructor(
        private processes: Process[],
        private products: Product[]) {

        this.graph = new Graph({ directed: true });
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

    getProcesses(): Process[] {

    }

    getProducts(): Product[] {

    }

    provideProduct(id: ProductId, value: any): void {
        
    }

    getProcessState(id: ProcessId): ProcessState {
        
    }

    invalidateProcess(id: ProcessId): void {

    }

    getProcessesInExecutionOrder(): Process[] {

    }

}