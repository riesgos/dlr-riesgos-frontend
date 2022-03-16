import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3g from 'd3-graphviz';

@Component({
  selector: 'app-graphvizcomp',
  templateUrl: './graphvizcomp.component.html',
  styleUrls: ['./graphvizcomp.component.scss']
})
export class GraphvizcompComponent implements OnChanges {

  @ViewChild('d3Div', {static: true}) private container: ElementRef;

  @Input() dotString: string;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.dotString) {
      return;
    }
    this.createGraph();
  }

  private createGraph(): void {
    const element = this.container.nativeElement;
    const dotString = this.dotString;
    const svg = d3g.graphviz(element, {useWorker: false})
      .width(800)
      .height(600)
      .fit(true)
      .renderDot(dotString);
  }


}
