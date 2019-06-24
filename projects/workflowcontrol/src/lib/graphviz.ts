import {WorkflowControl, Process, LifecyclePhase, ProductId} from "./workflowcontrol";

function attrsFromLifecyclePhase(lifecyclePhase: LifecyclePhase): string[] {
    const attrs: string[] = [];

    if (lifecyclePhase === LifecyclePhase.DONE) {
        attrs.push('style=filled');
        attrs.push('color=green');
    }
    else if (lifecyclePhase === LifecyclePhase.OUTDATED) {
        attrs.push('style=filled');
        attrs.push('color=red');
    }
    else if (lifecyclePhase === LifecyclePhase.MISSING_PRECONDITIONS) {
        attrs.push('style=filled');
        attrs.push('color=blue');
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
 * Nodes are colored depending on their lifecycle phase:
 * - uncolored = TODO
 * - green = DONE
 * - red = OUTDATED
 * - blue = MISSING_PRECONDITIONS
 *
 * This functionality is intended for development and debugging
 * purposes.
 */
export function toGraphviz<P extends Process>(wfc: WorkflowControl<P>): string {
    const lines: string[] = [];

    lines.push('digraph G {');

    for (let process of wfc.processesInExecutionOrder()) {
        const lifecyclePhase = wfc.getProcessLifecyclePhase(process.processId());
        const attrs = attrsFromLifecyclePhase(lifecyclePhase);
        lines.push('    "' + process.processId() + '" ['+ attrs.join(',') + '];');
    }

    lines.push('');

    for (let edge of wfc.edges()) {
        lines.push('   "' + edge.source.processId() + '" -> "' + edge.sink.processId() + '" [label="' + edge.products.join(', ') + '"];');
    }
    lines.push('}');
    return lines.join('\n');
}


export function productsToGraphviz<P extends Process>(wfc: WorkflowControl<P>): string {
    const lines: string[] = [];

    lines.push('digraph G {');

    const productGraph = wfc.getProductGraph();

    // collect products
    let products = new Set<ProductId>();
    for(const edge of productGraph.edges()) {
        products.add(edge.v);
        products.add(edge.w);
    }

    for(let product of products) {
        const state = wfc.getProductState(product);
        const attrs = attrsFromLifecyclePhase(state.lifecyclePhase);
        lines.push('    "' + product + '" ['+ attrs.join(',') + '];');
    }

    lines.push('');

    for (let edge of productGraph.edges()) {
        lines.push('   "' + edge.v + '" -> "' + edge.w + '";');
    }
    lines.push('}');
    return lines.join('\n');
}
