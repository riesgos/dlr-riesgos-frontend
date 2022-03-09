import { Component, OnInit, Input } from '@angular/core';
import Legend from 'ol-ext/legend/Legend';
import olFeature from 'ol/Feature';
import { Feature } from '@turf/helpers';
import Style from 'ol/style/Style';
import 'ol/ol.css';
import 'ol-ext/control/Legend.css';
import { SimplifiedTranslationService } from '../../../services/simplifiedTranslation/simplified-translation.service';


export interface LegendElement {
  feature: Feature;
  text: string;
}

interface Entry {
  canvas: HTMLElement;
  text: string;
}


@Component({
  selector: 'ukis-vector-legend',
  templateUrl: './vector-legend.component.html',
  styleUrls: ['./vector-legend.component.scss']
})
export class VectorLegendComponent implements OnInit {

  @Input() legendTitle: string;
  @Input() resolution: number;
  @Input() styleFunction: (feature: olFeature<any>, resolution: number) => Style;
  @Input() elementList: LegendElement[];
  public entries: Entry[] = [];


  constructor(
    private translator: SimplifiedTranslationService
  ) {}

  ngOnInit() {
    const legend = new Legend({
      title: this.legendTitle,
      style: (feature: olFeature<any>) => {
        const style = this.styleFunction(feature, this.resolution);
        // @ts-ignore
        if (style.text_) {
          // @ts-ignore
          delete (style.text_);
        }
        return style;
      },
      collapsible: false,
      margin: 0,
      size: [7, 7],
    });

    for (const element of this.elementList) {
      const canvas: HTMLCanvasElement = legend.getLegendImage({
        properties: element.feature.properties,
        typeGeom: element.feature.geometry.type
      }, null, null);

      // const html = this.translator.syncTranslate(element.text);

      this.entries.push({
        canvas: canvas,
        text: element.text
      });
    }

  }

}
