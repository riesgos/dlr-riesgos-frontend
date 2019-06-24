import {Graph} from 'graphlib';
import {alg as graph_alg} from 'graphlib';
import {json as graph_json} from 'graphlib';

export enum LifecyclePhase {
    TODO,
    DONE,
    OUTDATED,
    MISSING_PRECONDITIONS,
};

export type ProductData = any | null;
export type ProductId = string;
export type ProcessId = string;

export class MissingProductsError extends Error {
    public name: string = 'MissingProductsError';
    public products: ProductId[] = []
    constructor(_products: ProductId[]) {
        super();
        this.products = _products;
        this.message = 'missing products: ' + this.products.join(', ');
    }
}

export class EndOfWorkflow extends Error {
    public name: string = 'EndOfWorkflow';

}

/**
 * Interface for processes
 */
export interface Process {
    /**
     * Name of the Process. Must be unique in a workflow.
     */
    processId(): ProcessId

    /*
     * Returns an array of Products the process produces.
     */
    providesProducts(): ProductId[];

    /*
     * Returns an array of Products the process expects as inputs.
     */
    requiresProducts(): ProductId[];
}


class ProductState {
    public lifecyclePhase: LifecyclePhase = LifecyclePhase.TODO;
    public data: ProductData = null;
    public isProvidedByWorkflow: boolean = true;
}

export interface Edge<P extends Process> {
    source: P;
    sink: P;
    products: ProductId[];
}

export class WorkflowControl<P extends Process> {

    private processes = new Map<ProcessId, P>();
    private _processesInExecutionOrder: P[] = [];

    private _allowExternalProducts: boolean = false;

    private productStates = new Map<ProductId, ProductState>();
    private productProvidedBy = new Map<ProductId, ProcessId[]>();
    private productRequiredBy = new Map<ProductId, ProcessId[]>();

    private productGraph = new Graph({directed: true});

    constructor(processes: P[], allowExternalProducts: boolean = false) {
        this._allowExternalProducts = allowExternalProducts;

        for (let p of processes) {
            this.processes.set(p.processId(), p);
        }

        const productIds = new Set<ProductId>();
        for(const [pId, p] of this.processes.entries()) {
            const providesProducts = p.providesProducts();
            for(const productId of providesProducts) {
                productIds.add(productId);
                const value = this.productProvidedBy.get(productId) || [];
                if (value.indexOf(pId) === -1) {
                    value.push(pId);
                    this.productProvidedBy.set(productId, value);
                }
            }

            for(const productId of p.requiresProducts()) {
                productIds.add(productId);
                const value = this.productRequiredBy.get(productId) || [];
                if (value.indexOf(pId) === -1) {
                    value.push(pId);
                    this.productRequiredBy.set(productId, value);
                }

                for (const providesProduct of providesProducts) {
                    this.productGraph.setEdge(productId, providesProduct);
                }
            }
        }

        for (const pId of graph_alg.topsort(this.getProcessGraph())) {
            const p = this.processes.get(pId);
            if (p === undefined) {
                throw new Error('Process with ID ' + pId + ' not found. This should not happen');
            } else {
                this._processesInExecutionOrder.push(p);
            }
        }

        // create the states for the products
        for (let productId of productIds) {
            const pState = new ProductState();
            pState.isProvidedByWorkflow = ((this.productProvidedBy.get(productId) || []).length > 0);
            const inEdges = this.productGraph.inEdges(productId) || [];
            if (inEdges.length > 0) {
                pState.lifecyclePhase = LifecyclePhase.MISSING_PRECONDITIONS;
            }
            this.productStates.set(productId, pState);
        }

    }

    private getProcessGraph(): Graph {
        // # TODO: refactor this method
        const processGraph = new Graph({directed: true});
        for (let [productId, sinkProcesses] of this.productRequiredBy.entries()) {
            for (let sinkProcess of sinkProcesses) {
                const sourceProcesses: ProcessId[] = this.productProvidedBy.get(productId) || [];
                if (sourceProcesses.length > 0) {
                    for (const sourceProcess of sourceProcesses) {
                        processGraph.setEdge(sourceProcess, sinkProcess);
                    }
                }
                else {
                    if (!this._allowExternalProducts) {
                        throw new Error('Product ' + productId + ' is required but never provided');
                    }
                }
            }
        }

        if (!graph_alg.isAcyclic(processGraph)) {
            throw new Error('Process graphs with cycles are not supported');
        }

        return processGraph;
    }

    public getProductState(productId: ProductId): ProductState {
        const prodState = this.productStates.get(productId);
        if (prodState === undefined) {
            throw new Error('Product ' + productId + ' is not defined in the workflow.');
        }
        return prodState;
    }

    private getProcess(processId: ProcessId): P {
        const process = this.processes.get(processId);
        if (process === undefined) {
            throw new Error("Could not get process " + processId);
        }
        return process;
    }

    /**
     * return the value of the product with the given Id, or
     * undefined when the product is not set or outdated.
     */
    public getProduct(productId: ProductId): any {
        const prodState = this.getProductState(productId);
        if (prodState.lifecyclePhase === LifecyclePhase.DONE) {
            return prodState.data;
        }
        return undefined;
    }

    /**
     * Return the product or throw an error if the product is
     * not available or outdated
     */
    public getProductOrThrow(productId: ProductId): any {
        const data = this.getProduct(productId);
        if (data === undefined) {
            throw new Error('Product ' + productId + ' is not available');
        }
        return data;
    }

    /**
     * get the current lifecycle phase of a process.
     */
    public getProcessLifecyclePhase(processId: ProcessId): LifecyclePhase {
        const process = this.getProcess(processId);
        let lifecyclePhase = LifecyclePhase.DONE;
        for(const productId of process.providesProducts()) {
            const state = this.getProductState(productId);

            if (state.lifecyclePhase === LifecyclePhase.OUTDATED) {
                lifecyclePhase = state.lifecyclePhase;
                break;
            }
            else if (state.lifecyclePhase === LifecyclePhase.TODO) {
                lifecyclePhase = state.lifecyclePhase;
            }
            else if (state.lifecyclePhase === LifecyclePhase.MISSING_PRECONDITIONS) {
                lifecyclePhase = state.lifecyclePhase;
                break;
            }
            else {
                // ignore
            }
        }
        return lifecyclePhase;
    }


    private refreshProductState(productId: ProductId, recursive: boolean = true) {
        const prodState = this.getProductState(productId);
        let newLifecyclePhase = prodState.lifecyclePhase;

        const inEdges = this.productGraph.inEdges(productId);
        if (inEdges) {
            for(const edge of inEdges) {
                const inProdState = this.getProductState(edge.v);

                if (inProdState.lifecyclePhase == LifecyclePhase.OUTDATED) {
                    if (newLifecyclePhase == LifecyclePhase.DONE) {
                        newLifecyclePhase = LifecyclePhase.OUTDATED;
                        break;
                    }
                }
                else if (inProdState.lifecyclePhase == LifecyclePhase.DONE) {
                    if (newLifecyclePhase == LifecyclePhase.MISSING_PRECONDITIONS) {
                        newLifecyclePhase = LifecyclePhase.TODO;
                        break;
                    }
                }
                else if (inProdState.lifecyclePhase == LifecyclePhase.TODO) {
                    if (newLifecyclePhase !== LifecyclePhase.OUTDATED) {
                        newLifecyclePhase = LifecyclePhase.MISSING_PRECONDITIONS;
                        break;
                    }
                }
            }
        }

        const changed = (prodState.lifecyclePhase !== newLifecyclePhase);
        prodState.lifecyclePhase = newLifecyclePhase;

        if (recursive && changed) {
            const outEdges = this.productGraph.outEdges(productId);
            if (outEdges) {
                for (const edge of outEdges) {
                    this.refreshProductState(edge.w, recursive);
                }
            }
        }
    }

    private refreshChildren(productId: ProductId, recursive: boolean = true) {
        const outEdges = this.productGraph.outEdges(productId);
        if (outEdges) {
            for (const edge of outEdges) {
                this.refreshProductState(edge.w, recursive);
            }
        }
    }

    /**
     * set the data for the product with the given id.
     *
     * setting the data for a product early in the process chain of the workflow
     * means the products for all processes in the workflow, which come after the process
     * providing the set product, will become outdated and need to be reprocessed.
     */
    public setProduct(productId: ProductId, data: any) {
        const prodState = this.getProductState(productId);
        prodState.lifecyclePhase = LifecyclePhase.DONE;
        prodState.data = data;

        // set children to outdated when they have been processed before
        const outEdges = this.productGraph.outEdges(productId);
        if (outEdges) {
            for (const edge of outEdges) {
                let state = this.getProductState(edge.w);
                if (state.lifecyclePhase == LifecyclePhase.DONE) {
                    state.lifecyclePhase = LifecyclePhase.OUTDATED;
                }
            }
        }

        // propagte the change
        this.refreshChildren(productId);
    }

    /**
     * clear the product data of a product.
     *
     * clearing the data for a product early in the process chain of the workflow
     * means the products for all processes in the workflow, which come after the process
     * providing the set product, will become outdated and need to be reprocessed.
     */
    public clearProduct(productId: ProductId) {
        const prodState = this.getProductState(productId);
        prodState.lifecyclePhase = LifecyclePhase.TODO;
        prodState.data = null;
        this.refreshChildren(productId);
    }

    /**
     * Array of processes in excution order.
     */
    public processesInExecutionOrder(): P[] {
        return this._processesInExecutionOrder;
    }

    private _nextProcess(): P {
        for (const p of this._processesInExecutionOrder) {
            let is_next = false;

            for (const productId of p.providesProducts()) {
                const prodState = this.getProductState(productId);
                if (prodState.lifecyclePhase !== LifecyclePhase.DONE) {
                    is_next = true;
                    break;
                }
            }
                    
            if (is_next) {
                // check if all required products are supplied by other processes
                // or if they must be set from external code.
                let missingProducts: ProductId[] = [];
                for (const productId of p.requiresProducts()) {
                    const prodState = this.getProductState(productId);
                    if ((!prodState.isProvidedByWorkflow) && (prodState.lifecyclePhase !== LifecyclePhase.DONE)) {
                        missingProducts.push(productId);
                    }
                }
                if (missingProducts.length > 0) {
                    throw new MissingProductsError(missingProducts);
                }

                return p;
            }
        }
        throw new EndOfWorkflow('Reached end of workflow');
    }

    /**
     * get the next process to be executed.
     *
     * returns null when the end of the workflow is reached.
     *
     * may throw an MissingProductsError when some external products are missing.
     */
    public nextProcess(): (P | null) {
        try {
            return this._nextProcess();
        }
        catch (e) {
            if (e.name === 'EndOfWorkflow') {
                return null;
            }
            else {
                throw e;
            }
        }
    }

    /**
     * Return true when the workflow has completed all steps.
     */
    public isFinished(): boolean {
        for (const p of this._processesInExecutionOrder) {
            for (const productId of p.providesProducts()) {
                const prodState = this.getProductState(productId);
                if (prodState.lifecyclePhase !== LifecyclePhase.DONE) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Edges of the internal graph.
     *
     * This may be used for visualizations.
     */
    public edges(): Edge<P>[] {
        const edges: Edge<P>[] = [];

        for (let e of this.getProcessGraph().edges()) {
            const source = this.getProcess(e.v);
            const sink = this.getProcess(e.w);
            const providedBySource = new Set(source.providesProducts());
            const intersection = sink.requiresProducts().filter((pId) => providedBySource.has(pId));

            edges.push({
                source: source,
                sink: sink,
                products: intersection,
            });
        }
        return edges;
    }


    public getProductGraph(): Graph {
        return this.productGraph;
    }
}
