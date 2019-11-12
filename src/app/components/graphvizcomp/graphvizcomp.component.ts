import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, SimpleChanges, Self } from '@angular/core';
import * as d3base from 'd3';
import * as d3g from 'd3-graphviz';
const d3 = Object.assign(d3base, d3g);

@Component({
  selector: 'app-graphvizcomp',
  templateUrl: './graphvizcomp.component.html',
  styleUrls: ['./graphvizcomp.component.scss']
})
export class GraphvizcompComponent implements OnChanges {

  @ViewChild('d3Div', {static: true}) private container: ElementRef;

  @Input() dotString: string;

  constructor(
    // @Self() private element: ElementRef
    ) {
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
    const svg = d3.select(element)
      // .style('width', `${this.element.nativeElement.offsetWidth}px`)
      // .style('height', `${this.element.nativeElement.offsetHeight}px`)
        .graphviz({
          height: 600,
          width: 800,
          fit: true
        }).renderDot(dotString);
  }


}
