import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ColoringFunction, GroupedBarChartData, GroupingFunction, RearrangingGroupedBarChart } from './groupedChart';


export interface Grouping {
  label: string,
  groupingFunction: GroupingFunction,
  coloringFunction: ColoringFunction
}

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css']
})
export class GroupedBarChartComponent implements OnInit, AfterViewInit {

  @Input() xLabel: string = '';
  @Input() yLabel: string = '';
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
    this.selectedGrouping = this.groupings[0].label;
    this.graphHeight = this.height - 50;
  }

  ngAfterViewInit(): void {
    const container = this.container.nativeElement;
    this.chart = new RearrangingGroupedBarChart(container, this.width, this.height, this.xLabel, this.yLabel, this.baseData);
    this.chart.regroup(this.groupings[0].groupingFunction, this.groupings[0].coloringFunction);
  }

  updateGrouping(key: string) {
    this.selectedGrouping = key;
    const newGrouping = this.groupings.find(g => g.label == key);
    if (newGrouping) {
      this.chart.regroup(newGrouping.groupingFunction, newGrouping.coloringFunction);
    }
  }

}
