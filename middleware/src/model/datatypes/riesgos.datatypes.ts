import { Observable } from 'rxjs';


export interface RiesgosProduct {
    /** uid 
      *  - of the form `{url}_{processId}_{slotId}_{more-info}` (if it's a remotely provided product) 
      *  - of any unique form otherwise 
      */
    readonly uid: string;
    readonly options?: any[];
    value: any;
}

/**
 * The part of a riesgos-process that is 
 *  - sent over the network from the backend to the frontend
 *  - stored in the database
 * Does not contain an `execute` method
 *  - because that is only required on the backend-side
 *  - because it cannot be saved in a database.
 */
 export interface RiesgosProcess {
     /** uid 
      *  - of the form `{url}_{processId}` (if it's a remote service) 
      *  - of any unique form otherwise 
      */
    readonly uid: string;
    readonly inputSlots: string[];
    readonly outputSlots: string[];
    /** To be able to instantiate this process into a concrete class */
    readonly concreteClassName?: string;
}

/**
 * A concrete, executable Process.
 * Cannot be serialized, thus cannot be sent to client nor can it be stored in database.
 * Instead instantiated on the fly based on the information stored in `RiesgosProcess`.
 * Does *not* extend `RiesgosProcess`: this class is there only for one-off execution, and does
 * not care about graph-structure, dependencies etc.
 */
export interface ExecutableProcess {
    execute(
        inputs: {[slot: string]: RiesgosProduct},
        outputs: {[slot: string]: RiesgosProduct})
        : Observable<{[slot: string]: RiesgosProduct}>;
};

export interface Match {
    /** uid of the `RiesgosProduct`  */
    product: string;
    /** id of the slot at the `RiesgosProcess` */
    slot: string;
}

/**
 * Why do we use 'Call' and not the more common 'nodes'/'edges' representation of graphs?
 * Imagine we want to call 'ServiceA' twice, once with 'Input1', and once with 'Input2'.
 * The result of the first call shall be called 'Output1', the result of the second 'Output2'.
 * The 'nodes'/'edges' representation of a graph cannot distinguish between 'Output1' and 'Output2',
 * while the 'Call' representation can.
 */
export interface Call {
    process: string,
    inputs: Match[],
    outputs: Match[]
}

export interface RiesgosScenarioMetaData {
    id: string;
    calls: Call[]
}

export interface RiesgosScenarioData {
    metaData: RiesgosScenarioMetaData,
    processes: RiesgosProcess[],
    products: RiesgosProduct[]
}
