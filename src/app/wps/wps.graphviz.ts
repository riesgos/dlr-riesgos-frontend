import {Process, ProcessStateTypes, Product} from "./wps.datatypes";
import {WorkflowControl} from "./wps.workflowcontrol";
import { Graph } from 'graphlib';


const green = '"#b3ffb3"';
const blue = '"#b3f0ff"';
const red = '"#ffb3b3"';
const yellow = '"#ffffcc"';


function attrsFromProcessStateTypes(processState: string): string[] {
    const attrs: string[] = [];

    if (processState === ProcessStateTypes.completed) {
        attrs.push('style=filled');
        attrs.push('color=' +  green);
    }
    else if (processState === ProcessStateTypes.error) {
        attrs.push('style=filled');
        attrs.push('color=' + red);
    }
    else if (processState === ProcessStateTypes.available) {
        attrs.push('style=filled');
        attrs.push('color=' + blue);
    }
    else if (processState === ProcessStateTypes.running) {
        attrs.push('style=filled');
        attrs.push('color=' + yellow);
    }

    return attrs;
}

function attrsFromProductState(product: Product): string[] {
    const attrs: string[] = [];

    if (product.value) {
        attrs.push('style=filled');
        attrs.push('color=' + green);
    }

    return attrs;
}

function sanitizeLabel(label: string): string {
    return label.replace('.', '_');
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

    for (let process of wfc.getImmutableProcesses()) {
        const attrs = attrsFromProcessStateTypes(process.state.type);
        attrs.push("shape=box");
        attrs.push('label="' + process.name + '"');
        lines.push('    "' + process.uid + '" ['+ attrs.join(',') + '];');
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
        attrs.push('label="' + sanitizeLabel(process.name || process.uid) + '"');
        lines.push('    "' + sanitizeLabel(process.uid) + '" [' + attrs.join(',') + '];');
    }
    for (const product of products) {
        const attrs = attrsFromProductState(product);
        attrs.push('shape=oval');
        attrs.push('label="' + sanitizeLabel(product.description['name'] || product.uid) + '"');
        lines.push('    "' + sanitizeLabel(product.uid) + '" [' + attrs.join(',') + '];');
    }

    lines.push('');

    for (const e of graph.edges()) {
        lines.push('   "' + e.v + '" -> "' + e.w + '" [];');
    }
    lines.push('}');
    return lines.join('\n');
}

