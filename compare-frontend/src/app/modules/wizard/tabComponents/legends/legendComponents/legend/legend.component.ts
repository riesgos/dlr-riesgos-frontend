import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { legendComponent, LegendDirection, LegendEntry } from 'src/app/helpers/d3legend';
import { select } from 'd3-selection';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {

  @Input() title: string = '';
  @Input() text: string = '';
  @Input() id: string = 'GradientNr' + Math.floor(Math.random() * 1000) + '';
  @Input() width: number = 250;
  @Input() height: number = 250;
  @Input() direction: LegendDirection = 'vertical';
  @Input() fractionGraphic = this.direction === 'vertical' ? 0.125 : 0.5;
  @Input() margin = 10;
  @Input() continuous = false;
  @Input() entries: LegendEntry[] = [];
  @ViewChild('legendAnchor', {static: true}) div!: ElementRef;


  constructor(private translator: TranslationService) { }

  ngOnInit(): void {
    this.translator.getCurrentLang().subscribe(lang => {
      
      const translatedEntries: LegendEntry[] = [];
      for (const entry of this.entries) {
        translatedEntries.push({
          ... entry,
          text: this.translator.syncTranslate(entry.text)
        });
      }

      const legend = legendComponent()
        .id(this.id)
        .width(this.width).height(this.height).direction(this.direction)
        .fractionGraphic(this.fractionGraphic).margin(this.margin)
        .continuous(this.continuous)
        .entries(translatedEntries);

      const selection = select(this.div.nativeElement);
      selection.selectAll('.legendGroup').remove();
      selection.call(legend);

    });
  }
}
