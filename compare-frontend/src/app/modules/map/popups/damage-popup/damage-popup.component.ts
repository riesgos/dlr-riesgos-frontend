import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DeusMetaData } from './deusApi';
import { TranslationService } from 'src/app/services/translation.service';
import { FeatureLike } from 'ol/Feature';
import { BarDatum, createBigBarChart } from 'src/app/helpers/d3charts';
import { exposureDamageRange, yellowPurpleRange, yellowRedRange } from 'src/app/helpers/colorhelpers';



type knownSchemas = 'SARA_v1.0' | 'SUPPASRI2013_v2.0' | 'Medina_2019';


@Component({
  selector: 'app-damage-popup',
  templateUrl: './damage-popup.component.html',
  styleUrls: ['./damage-popup.component.scss']
})
export class DamagePopupComponent implements OnInit, AfterViewInit {

  @Input() feature!: FeatureLike;
  @Input() metaData!: DeusMetaData;
  @Input() additionalText?: string;
  @Input() heading?: string;
  @Input() xLabel!: string;
  @Input() yLabel!: string;
  public countTotal: string | undefined;
  public width = 300;
  public height = 250;
  public data: BarDatum[] = [];
  @ViewChild('container', {static: true}) container!: ElementRef<HTMLDivElement>;


  constructor(private http: HttpClient, private translateSvc: TranslationService) {}
  
  ngOnInit(): void {
    let data: BarDatum[] = [];
    data = [{
      label: 'D0',
      value: 0,
      color: `rgb(${exposureDamageRange(0, 4, 0).join(',')})`,
      hoverText: ``
    }, {
      label: 'D1',
      value: 0,
      color: `rgb(${exposureDamageRange(0, 4, 1).join(',')})`,
      hoverText: ``
    }, {
      label: 'D2',
      value: 0,
      color: `rgb(${exposureDamageRange(0, 4, 2).join(',')})`,
      hoverText: ``
    }, {
      label: 'D3',
      value: 0,
      color: `rgb(${exposureDamageRange(0, 4, 3).join(',')})`,
      hoverText: ``
    }, {
      label: 'D4',
      value: 0,
      color: `rgb(${exposureDamageRange(0, 4, 4).join(',')})`,
      hoverText: ``
    }];
  
    const props = this.feature.getProperties();
    for (const [key, value] of Object.entries(props)) {
      const translatedKey = this.metaData.custom_columns[key];
      if (translatedKey && translatedKey.startsWith("Buildings in") && translatedKey.endsWith("per damage state")) {
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
      datum.value = datum.value;
      datum.hoverText = "" + datum.value.toPrecision(3) + " edificios";
      countTotal += datum.value;
    }
  
  
    this.data = data;
    if (countTotal <= 0) {
      this.data = [];
      this.width = 0;
      this.height = 0;
      this.additionalText = 'no_residential_buildings';
    } else {
      this.countTotal = Math.round(countTotal) + "";
    }
  
    setTimeout(() => { // if not timeout, then labels don't have enough space on graph
      createBigBarChart(
        this.container.nativeElement, 
        this.data, 
        this.width, 
        this.height, 
        this.translateSvc.translate(this.xLabel),
        this.translateSvc.translate(this.yLabel),
        ''
      );
    }, 100);
  }
  
  ngAfterViewInit(): void {
  }

}
