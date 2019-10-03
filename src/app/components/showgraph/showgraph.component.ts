import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getCurrentScenarioWpsState } from 'src/app/wps/wps.selectors';
import { WpsState, WpsScenarioState } from 'src/app/wps/wps.state';
import { toGraphvizDestructured } from 'src/app/wps/wps.graphviz';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-showgraph',
  templateUrl: './showgraph.component.html',
  styleUrls: ['./showgraph.component.scss']
})
export class ShowgraphComponent implements OnInit {

  public dotString$: BehaviorSubject<string>;
  public showModal = false;

  constructor(private store: Store<State>) {
    this.dotString$ = new BehaviorSubject<string>('digraph {a -> b}');
  }

  ngOnInit() {
    this.store.select(getCurrentScenarioWpsState).subscribe((currentState: WpsScenarioState) => {
      if (currentState) {
        const processes = currentState.processStates;
        const products = currentState.productValues;
        const graph = currentState.graph;
        const dotString = toGraphvizDestructured(processes, products, graph);
        this.dotString$.next(dotString);
      }
    });
  }

}
