import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { circleLegendComponent, LegendEntry, Orientation } from 'src/app/helpers/d3circlelegend';
import { select } from 'd3-selection';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-circle-legend',
  templateUrl: './circle-legend.component.html',
  styleUrls: ['./circle-legend.component.scss']
})
export class CircleLegendComponent implements OnInit {

  @Input() title: string = '';
  @Input() text: string = '';
  @Input() width: number = 250;
  @Input() height: number = 250;
  @Input() orientation: Orientation = 'vertical';
  @Input() entries: LegendEntry[] = [];
  @ViewChild('legendAnchor', {static: true}) div!: ElementRef;

  

  constructor(private translator: TranslationService) { }

  ngOnInit(): void {
    this.translator.getCurrentLang().subscribe(lang => {
      
      const translatedEntries: LegendEntry[] = [];
      for (const entry of this.entries) {
        translatedEntries.push({
          ... entry,
          label: this.translator.syncTranslate(entry.label)
        });
      }

      const legend = circleLegendComponent()
        .width(this.width).height(this.height).orientation(this.orientation)
        .data(translatedEntries);

      const selection = select(this.div.nativeElement);
      selection.selectAll('.legendGroup').remove();
      selection.call(legend);

    });
  }
}
