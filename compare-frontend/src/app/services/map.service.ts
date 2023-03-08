import { Injectable } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  init(nativeElement: HTMLDivElement) {
    const osm = new TileLayer({
      source: new OSM()
    });
    const layers = [osm];
    const map = new Map({
      layers: layers,
      view: new View({
        projection: 'EPSG:4326',
        center: [-50, -20],
        zoom: 4
      }),
      target: nativeElement,
      controls: []
    });
  }
}
