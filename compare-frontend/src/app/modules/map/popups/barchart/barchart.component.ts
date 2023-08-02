import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BarDatum, createBigBarChart } from 'src/app/helpers/d3charts';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit, AfterViewInit {

  @Input() data: BarDatum[] = [];
  @Input() width = 600;
  @Input() height = 400;
  @Input() title = '';
  @Input() xLabel = 'xLabel';
  @Input() yLabel = 'yLabel';
  @Input() smallPrint = '';
  @Input() noData = 'NoData';
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  constructor(private translate: TranslationService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const container = this.container.nativeElement;

    const translatedData = this.data.map(entry => {
      return {
        ... entry,
        hoverText: this.translate.translate(entry.label)
      }
    });

    createBigBarChart(
      container, 
      translatedData, 
      this.width, 
      this.height, 
      this.translate.translate(this.xLabel),
      this.translate.translate(this.yLabel),
      this.translate.translate(this.noData)
    );
  }
}
