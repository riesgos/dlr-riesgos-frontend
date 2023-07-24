import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DeusMetaData } from './deusApi';
import { TranslationService } from 'src/app/services/translation.service';
import { FeatureLike } from 'ol/Feature';
import { BarDatum, createBigBarChart } from 'src/app/helpers/d3charts';
import { yellowPurpleRange, yellowRedRange } from 'src/app/helpers/colorhelpers';



type knownSchemas = 'SARA_v1.0' | 'SUPPASRI2013_v2.0' | 'Medina_2019';

@Component({
  selector: 'app-damage-popup',
  templateUrl: './damage-popup.component.html',
  styleUrls: ['./damage-popup.component.scss']
})
export class DamagePopupComponent implements OnInit, AfterViewInit {

  @Input() metaData!: DeusMetaData;
  @Input() feature!: FeatureLike;
  @Input() schema!: knownSchemas;
  @Input() additionalText?: string;
  @Input() heading?: string;
  @Input() xLabel!: string;
  @Input() yLabel!: string;
  public width = 300;
  public height = 250;
  public data: BarDatum[] = [];
  @ViewChild('container', {static: true}) container!: ElementRef<HTMLDivElement>;


  constructor(private http: HttpClient, private translateSvc: TranslationService) {}
  
  ngOnInit(): void {
    let data: BarDatum[] = [];
    data = [{
      label: '0',
      value: 0,
      color: `rgb(${yellowRedRange(0, 4, 0).join(',')})`,
      hoverText: ``
    }, {
      label: '1',
      value: 0,
      color: `rgb(${yellowRedRange(0, 4, 1).join(',')})`,
      hoverText: ``
    }, {
      label: '2',
      value: 0,
      color: `rgb(${yellowRedRange(0, 4, 2).join(',')})`,
      hoverText: ``
    }, {
      label: '3',
      value: 0,
      color: `rgb(${yellowRedRange(0, 4, 3).join(',')})`,
      hoverText: ``
    }, {
      label: '4',
      value: 0,
      color: `rgb(${yellowRedRange(0, 4, 4).join(',')})`,
      hoverText: ``
    }];

    const props = this.feature.getProperties();
    for (const [key, value] of Object.entries(props)) {
      if (['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20', 'c21', 'c22'].includes(key)) {
        if (value !== undefined && value !== "") {
          const classData = JSON.parse(value);
          for (const [dmgClass, count] of Object.entries(classData)) {
            const datum = data[+dmgClass];
            datum.value += +(count as number);
          }
        }
      }
    }

    let countTotal = 0;
    for (const datum of data) {
      datum.hoverText = "" + datum.value.toFixed(2) + " edificios";
      countTotal += datum.value;
    }

    this.data = data;
    if (countTotal <= 0) {
      this.data = [];
      this.width = 0;
      this.height = 0;
      this.additionalText = 'no_residential_buildings';
    }
  
    createBigBarChart(
      this.container.nativeElement, 
      this.data, 
      this.width, 
      this.height, 
      this.translateSvc.translate(this.xLabel),
      this.translateSvc.translate(this.yLabel),
      ''
    );
  }

  ngAfterViewInit(): void {
  }

}
