import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import Legend from 'ol-ext/control/Legend';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import 'ol/ol.css';
import 'ol-ext/control/Legend.css';


export interface LegendElement {
  feature: Feature;
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
  @Input() styleFunction: (feature: Feature, resolution: number) => Style;
  @Input() elementList: LegendElement[];
  @ViewChild('canvasDiv', {static: true}) canvasDiv: ElementRef;

  constructor() { }

  ngOnInit() {

    const dummyStyleFunction = function (feature: any, resolution: number) {
      const r = 130;
      const g = 0;
      const b = 130;
      return new Style({
          fill: new Fill({
            color: [r, g, b, 0.3],
          }),
          stroke: new Stroke({
            color: [r, g, b, 1],
            witdh: 2
          })
        });
  };

    const legend = new Legend({
      title: this.legendTitle,
      style: (feature: Feature) => dummyStyleFunction(feature, this.resolution),
      collapsible: false,
      margin: 0,
      size: [80, 80],
    });

    const canvas = legend.getStyleImage({
      properties: { pop: 2600000 },
      typeGeom: 'Polygon'
    }, null, null);

    const legendDiv = this.canvasDiv.nativeElement;
    if (legendDiv) {
      legendDiv.append(canvas);
    }
  }

}
