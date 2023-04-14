import { AfterViewInit, Component, Input, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-multi-legend',
  templateUrl: './multi-legend.component.html',
  styleUrls: ['./multi-legend.component.scss']
})
export class MultiLegendComponent implements OnInit {

  @Input() legendComponents: {
    component: Type<any>,
    args: {[key: string]: any}
  }[] = [];

  @ViewChild("anchor", { read: ViewContainerRef, static: true }) anchor!: ViewContainerRef;

  constructor() { }

  ngOnInit(): void {
    for (const component of this.legendComponents) {
      const componentRef = this.anchor.createComponent(component.component);
      for (const key in component.args) {
        componentRef.instance[key] = component.args[key];
      }
    }
  }

}
