import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BarData, createBigBarChart } from 'src/app/helpers/d3charts';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit, AfterViewInit {

  @Input() data: BarData[] = [];
  @Input() width = 600;
  @Input() height = 400;
  @Input() title = '';
  @Input() xLabel = 'xLabel'; // @TODO: translate
  @Input() yLabel = 'yLabel';
  @Input() noData = 'NoData';
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const container = this.container.nativeElement;

    const translatedData = this.data.map(entry => {
      return {
        ... entry,
        hoverText: entry.label
      }
    });

    createBigBarChart(
      container, 
      translatedData, 
      this.width, 
      this.height, 
      this.xLabel,
      this.yLabel,
      this.noData
    );
  }
}
