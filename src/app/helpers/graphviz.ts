import { Process, Product, ProcessStateTypes } from '../wps/wps.datatypes';
import { Graph } from 'graphlib';



const green = '"#b3ffb3"';
const blue = '"#b3f0ff"';
const red = '"#ffb3b3"';
const yellow = '"#ffffcc"';


export function toGraphvizFull(processes: Process[], products: Product[], graph: Graph): string {
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

export function attrsFromProcessStateTypes(processState: string): string[] {
    const attrs: string[] = [];

    if (processState === ProcessStateTypes.completed) {
      attrs.push('style=filled');
      attrs.push('color=' + green);
    } else if (processState === ProcessStateTypes.error) {
      attrs.push('style=filled');
      attrs.push('color=' + red);
    } else if (processState === ProcessStateTypes.available) {
      attrs.push('style=filled');
      attrs.push('color=' + blue);
    } else if (processState === ProcessStateTypes.running) {
      attrs.push('style=filled');
      attrs.push('color=' + yellow);
    }

    return attrs;
}

export function attrsFromProductState(product: Product): string[] {
    const attrs: string[] = [];

    if (product.value) {
      attrs.push('style=filled');
      attrs.push('color=' + green);
    }

    return attrs;
}

export function sanitizeLabel(label: string): string {
    return label.replace('.', '_');
} 
