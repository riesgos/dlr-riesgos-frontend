import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ColoringFunction, GroupedBarChartData, GroupingFunction, RearrangingGroupedBarChart } from './groupedChart';


export interface Grouping {
  id: string,
  label: () => string,
  xLabel: () => string,
  yLabel: () => string,
  groupingFunction: GroupingFunction,
  coloringFunction: ColoringFunction
}

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css']
})
export class GroupedBarChartComponent implements OnInit, AfterViewInit {

  @Input() width: number = 500;
  @Input() height: number = 400;
  @Input() baseData: GroupedBarChartData[] = [];
  @Input() groupings: Grouping[] = [];
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  private chart!: RearrangingGroupedBarChart;
  public selectedGrouping!: string;
  public graphHeight = 350;

  constructor() { }

  ngOnInit(): void {
    this.selectedGrouping = this.groupings[0].id;
    this.graphHeight = this.height - 50;
  }

  ngAfterViewInit(): void {
    const container = this.container.nativeElement;
    this.chart = new RearrangingGroupedBarChart(container, this.width, this.height, this.baseData);
    const grouping = this.groupings[0];
    this.chart.regroup(grouping.groupingFunction, grouping.coloringFunction, grouping.xLabel(), grouping.yLabel());
  }

  updateGrouping(key: string) {
    this.selectedGrouping = key;
    const newGrouping = this.groupings.find(g => g.id == key);
    if (newGrouping) {
      this.chart.regroup(newGrouping.groupingFunction, newGrouping.coloringFunction, newGrouping.xLabel(), newGrouping.yLabel());
    }
  }

}
