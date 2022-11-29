import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Entry, legendComponent, LegendDirection } from 'src/app/helpers/d3legend';
import { select } from 'd3';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {

  @Input() id: string = 'GradientNr' + Math.floor(Math.random() * 1000) + '';
  @Input() width: number = 250;
  @Input() height: number = 250;
  @Input() direction: LegendDirection = 'vertical';
  @Input() continuous = false;
  @Input() fractionGraphic = 0.5;
  @Input() margin = 10;
  @Input() entries: Entry[] = [];
  @ViewChild('legendAnchor', {static: true}) div: ElementRef;


  constructor() { }

  ngOnInit(): void {
    const legend = legendComponent()
      .id(this.id)
      .width(this.width).height(this.height).direction(this.direction)
      .continuous(this.continuous).fractionGraphic(this.fractionGraphic).margin(this.margin)
      .entries(this.entries);

    const selection = select(this.div.nativeElement);
    selection.call(legend);
  }

}
