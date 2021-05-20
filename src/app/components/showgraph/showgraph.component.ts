import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getCurrentScenarioRiesgosState } from 'src/app/riesgos/riesgos.selectors';
import { RiesgosScenarioState } from 'src/app/riesgos/riesgos.state';
import { BehaviorSubject } from 'rxjs';
import { Process, Product, ProcessStateTypes } from 'src/app/riesgos/riesgos.datatypes';
import { Graph } from 'graphlib';
import { TranslateService } from '@ngx-translate/core';


const black = '"#000000"';
const white = '"#ffffff"';
const green = '"#b3ffb3"';
const blue = '"#b3f0ff"';
const red = '"#ffb3b3"';
const yellow = '"#ffffcc"';


@Component({
  selector: 'app-showgraph',
  templateUrl: './showgraph.component.html',
  styleUrls: ['./showgraph.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShowgraphComponent implements OnInit {

  public dotStringPO$: BehaviorSubject<string>;
  public dotStringFull$: BehaviorSubject<string>;
  public showModal = false;
  private currentState: RiesgosScenarioState;

  constructor(
    private store: Store<State>,
    private translator: TranslateService
  ) {
    this.dotStringFull$ = new BehaviorSubject<string>('digraph {}');
    this.dotStringPO$ = new BehaviorSubject<string>('digraph {}');
  }

  ngOnInit() {
    this.store.select(getCurrentScenarioRiesgosState).subscribe((currentState: RiesgosScenarioState) => {
      if (currentState) {
        this.currentState = currentState;
        const processes = currentState.processStates;
        const products = currentState.productValues;
        const graph = currentState.graph;
        const dotStringFull = this.toGraphvizFull(processes, products, graph);
        this.dotStringFull$.next(dotStringFull);
        const dotStringPO = this.toGraphvizProcessesOnly(processes, graph);
        this.dotStringPO$.next(dotStringPO);
      }
    });

    this.translator.onLangChange.subscribe(() => {
      const processes = this.currentState.processStates;
      const products = this.currentState.productValues;
      const graph = this.currentState.graph;
      const dotStringFull = this.toGraphvizFull(processes, products, graph);
      this.dotStringFull$.next(dotStringFull);
      const dotStringPO = this.toGraphvizProcessesOnly(processes, graph);
      this.dotStringPO$.next(dotStringPO);
    });
  }

  private toGraphvizProcessesOnly(processes: Process[], graph: Graph): string {
    const lines: string[] = [];

    const processIds = processes.map(prc => prc.uid);

    lines.push('digraph Dependencies {');
    lines.push('bgcolor="#ffffff00";');
    lines.push('truecolor=true;');

    for (const process of processes) {
      const attrs = this.attrsFromProcessStateTypes(process.state.type);
      attrs.push('shape=box');
      attrs.push('label="' + this.sanitizeLabel(this.translate(process.name || process.uid)) + '"');
      lines.push('    "' + this.sanitizeLabel(process.uid) + '" [' + attrs.join(',') + '];');
    }

    lines.push('');

    for (const id of processIds) {
      const targets = this.getChildProcessesOf(id, graph);
      for (const target of targets) {
        lines.push('   "' + id + '" -> "' + target + '" [];');
      }
    }

    lines.push('}');
    return lines.join('\n');
  }

  private getChildProcessesOf(id: string, graph: Graph): string[] {
    let childProcessIds: string[] = [];
    const childProducts = graph.outEdges(id).map(edge => edge.w);
    for (const prod of childProducts) {
      const childProcesses = graph.outEdges(prod).map(edge => edge.w);
      childProcessIds = childProcessIds.concat(childProcesses);
    }
    return childProcessIds;
  }

  private toGraphvizFull(processes: Process[], products: Product[], graph: Graph): string {
    const lines: string[] = [];

    lines.push('digraph Dependencies {');
    lines.push('bgcolor="#ffffff00";');
    lines.push('truecolor=true;');


    for (const process of processes) {
      const attrs = this.attrsFromProcessStateTypes(process.state.type);
      attrs.push('shape=box');
      attrs.push('label="' + this.sanitizeLabel(this.translate(process.name || process.uid)) + '"');
      lines.push('    "' + this.sanitizeLabel(process.uid) + '" [' + attrs.join(',') + '];');
    }
    for (const product of products) {
      const attrs = this.attrsFromProductState(product);
      attrs.push('shape=oval');
      attrs.push('label="' + this.sanitizeLabel(this.translate(product.description['name'] || product.uid)) + '"');
      lines.push('    "' + this.sanitizeLabel(product.uid) + '" [' + attrs.join(',') + '];');
    }

    lines.push('');

    for (const e of graph.edges()) {
      lines.push('   "' + e.v + '" -> "' + e.w + '" [];');
    }
    lines.push('}');
    return lines.join('\n');
  }


  private attrsFromProcessStateTypes(processState: string): string[] {
    const attrs: string[] = [];

    attrs.push('style="filled,solid"');
    attrs.push('color=' + black);
    if (processState === ProcessStateTypes.completed) {
      attrs.push('fillcolor=' + green);
    } else if (processState === ProcessStateTypes.error) {
      attrs.push('fillcolor=' + red);
    } else if (processState === ProcessStateTypes.available) {
      attrs.push('fillcolor=' + blue);
    } else if (processState === ProcessStateTypes.running) {
      attrs.push('fillcolor=' + yellow);
    } else {
      attrs.push('fillcolor=' + white);
    }

    return attrs;
  }

  private attrsFromProductState(product: Product): string[] {
    const attrs: string[] = [];

    attrs.push('style="filled,solid"');
    attrs.push('color=' + black);
    if (product.value) {
      attrs.push('fillcolor=' + green);
    } else {
      attrs.push('fillcolor=' + white);
    }

    return attrs;
  }

  private sanitizeLabel(label: string): string {
    return label.replace('.', '_');
  }

  private translate(text: string): string {
    return this.translator.instant(text);
  }

}
