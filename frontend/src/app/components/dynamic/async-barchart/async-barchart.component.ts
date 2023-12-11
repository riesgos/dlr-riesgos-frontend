import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BarData } from 'src/app/helpers/d3charts';

@Component({
  selector: 'app-async-barchart',
  templateUrl: './async-barchart.component.html',
  styleUrls: ['./async-barchart.component.scss']
})
export class AsyncBarchartComponent implements OnInit {

  @Input() width = 600;
  @Input() height = 400;
  @Input() title = '';
  @Input() xLabel = 'xLabel'; // @TODO: translate
  @Input() yLabel = 'yLabel';
  @Input() noData = 'NoData';
  @Input() data$: Observable<BarData[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
