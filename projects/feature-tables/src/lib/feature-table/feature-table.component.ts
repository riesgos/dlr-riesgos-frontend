import { Component, OnInit, Input } from '@angular/core';
import { FeatureCollection, Feature } from '@turf/helpers';
import { VectorLayer } from '@ukis/services-layers';

@Component({
  selector: 'ukis-feature-table',
  templateUrl: './feature-table.component.html',
  styleUrls: ['./feature-table.component.css']
})
export class FeatureTableComponent implements OnInit {

  @Input() vectorLayer: VectorLayer;
  features: Feature[];
  properties: string[];
  title: string;

  constructor() { }

  ngOnInit() {
    let featureCollection: FeatureCollection = this.vectorLayer.data;
    this.title = this.vectorLayer.name;
    this.features = featureCollection.features;
    // @ts-ignore
    this.properties = Object.keys(this.features[0].properties);
  }

}
