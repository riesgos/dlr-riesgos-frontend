import { WorkflowControl } from 'projects/workflowcontrol/src/public_api';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { WpsClient, WpsData, WpsInput } from 'projects/services-wps/src/public_api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WpsProcess } from './wpsProcess';
import { ProcessState } from './wps.state';
import { processes } from '../processes';



/**
 * workflowcontrol: 
 *  - holds productId: string and productData: WpsData
 */


@Injectable()
export class WpsWorkflowControl {
    
    private workflowcontrol: WorkflowControl<WpsProcess>;
    private processes: WpsProcess[];

    constructor(
        private wpsClient: WpsClient
    ) {
        this.processes = processes;
        this.workflowcontrol = new WorkflowControl<WpsProcess>(this.processes, true);
    }

    setProduct(product: Product): void {
        this.workflowcontrol.setProduct(product.productId, product.productData);
    }

    getStates(): ProcessState[] {
        let states: ProcessState[] = [];
        for(let process of this.workflowcontrol.processesInExecutionOrder()) {
            let processId = process.processId();
            states.push({
                processId: processId, 
                processState: this.workflowcontrol.getProcessLifecyclePhase(processId)
            });
        }
        return states;
    }

    executeProcess(process: WpsProcess): Observable<Product[]> {
        const inputs = this.getInputs(process); 
        const output = process.outputDescription;
        return this.wpsClient.executeAsync(process.url, process.processId(), inputs, output).pipe(
            map((results: WpsData[]) => {
                return results.map(result => {
                    return {productId: result.id, productData: result}
                });
            })
        )
    }

    private getInputs(process: WpsProcess): WpsInput[] {
        let inputs: WpsInput[] = [];
        const inputDescriptions = process.inputDescriptions;
        for (let description of inputDescriptions) {
            let value = this.workflowcontrol.getProduct(description.id);
            inputs.push({
                ... description,
                data: value
            });
        }
        return inputs;
    }
}