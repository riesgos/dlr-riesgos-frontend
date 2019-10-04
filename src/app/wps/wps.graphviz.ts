import {Process, ProcessStateTypes, Product} from "./wps.datatypes";
import {WorkflowControl} from "./wps.workflowcontrol";
import { Graph } from 'graphlib';


function attrsFromProcessStateTypes(processState: string): string[] {
    const attrs: string[] = [];

    if (processState === ProcessStateTypes.completed) {
        attrs.push('style=filled');
        attrs.push('color=gray72');
    }
    else if (processState === ProcessStateTypes.error) {
        attrs.push('style=filled');
        attrs.push('color=red');
    }
    else if (processState === ProcessStateTypes.available) {
        attrs.push('style=filled');
        attrs.push('color=gold1');
    }
    else if (processState === ProcessStateTypes.running) {
        attrs.push('style=filled');
        attrs.push('color=green1');
    }

    return attrs;
}

/**
 * Return a Graphviz description of the workflow.
 *
 * This is intended for visualisation purposes either with
 * graphviz directly or with the javascript port at
 * [viz-js.com](http://viz-js.com).
 *
 * Nodes are colored depending on their process state
 *
 * This functionality is intended for development and debugging
 * purposes.
 */
export function toGraphviz(wfc: WorkflowControl): string {
    const lines: string[] = [];

    lines.push('digraph G {');

    for (let process of wfc.getProcesses()) {
        const attrs = attrsFromProcessStateTypes(process.state.type);
        attrs.push("shape=box");
        attrs.push('label="' + process.name + '"');
        lines.push('    "' + process.id + '" ['+ attrs.join(',') + '];');
    }
    for (let product of wfc.getProducts()) {
        lines.push('    "' + product.uid + '" [label="' +product.description['id'] + '", shape=oval];');
        
    }

    lines.push('');

    for (let e of wfc.getGraph().edges()) {
        lines.push('   "' + e.v + '" -> "' + e.w + '" [];');
    }
    lines.push('}');
    return lines.join('\n');
}

export function toGraphvizDestructured(processes: Process[], products: Product[], graph: Graph): string {
    const lines: string[] = [];

    lines.push('digraph G {');

    for (const process of processes) {
        const attrs = attrsFromProcessStateTypes(process.state.type);
        attrs.push('shape=box');
        attrs.push('label="' + process.name + '"');
        lines.push('    "' + process.id + '" [' + attrs.join(',') + '];');
    }
    for (let product of products) {
        lines.push('    "' + product.uid + '" [label="' + product.description['id'] + '", shape=oval];');
    }

    lines.push('');

    for (const e of graph.edges()) {
        lines.push('   "' + e.v + '" -> "' + e.w + '" [];');
    }
    lines.push('}');
    return lines.join('\n');
}

