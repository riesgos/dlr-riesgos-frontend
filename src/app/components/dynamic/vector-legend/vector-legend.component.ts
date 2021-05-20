import { Component, OnInit, Input } from '@angular/core';
import Legend from 'ol-ext/control/Legend';
import olFeature from 'ol/Feature';
import { Feature } from '@turf/helpers';
import Style from 'ol/style/Style';
import 'ol/ol.css';
import 'ol-ext/control/Legend.css';


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
  @Input() styleFunction: (feature: olFeature, resolution: number) => Style;
  @Input() elementList: LegendElement[];
  public entries: Entry[] = [];

  constructor() { }

  ngOnInit() {
    const legend = new Legend({
      title: this.legendTitle,
      style: (feature: olFeature) => {
        const style = this.styleFunction(feature, this.resolution);
        if (style.text_) {
          delete(style.text_);
        }
        return style;
      },
      collapsible: false,
      margin: 0,
      size: [20, 20],
    });

    for (const element of this.elementList) {
      const canvas: HTMLCanvasElement = legend.getStyleImage({
        properties: element.feature.properties,
        typeGeom: element.feature.geometry.type
      }, null, null);

      this.entries.push({
        canvas: canvas,
        text: element.text
      });
    }

  }

}
