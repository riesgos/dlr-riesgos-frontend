import { Injectable } from '@angular/core';
import { Map, View } from 'ol';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTile from 'ol/source/VectorTile';
import OSM from 'ol/source/OSM';
import MVT from 'ol/format/MVT';
import { createXYZ } from 'ol/tilegrid';
import { applyStyle } from 'ol-mapbox-style';
import grayScale from 'src/app/data/open-map-style.Positron.json';
import TileLayer from 'ol/layer/Tile';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  init(nativeElement: HTMLDivElement) {

    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // const baseLayer = new VectorTileLayer({
    //   declutter: true,
    //   source: new VectorTile({
    //     format: new MVT(),
    //     tileGrid: createXYZ({
    //       minZoom: 0,
    //       maxZoom: 12
    //     }),
    //     url: 'https://{a-d}.tiles.geoservice.dlr.de/service/tms/1.0.0/planet_eoc@EPSG%3A4326@pbf/{z}/{x}/{y}.pbf?flipy=true'
    //   }),
    //   renderMode: 'hybrid',
    // });
    // applyStyle(baseLayer, grayScale, 'planet0-12');
   

    const layers = [baseLayer];

    const map = new Map({
      layers: layers,
      view: new View({
        projection: 'EPSG:4326', // 'EPSG:900913',
        center: [-50, -20],
        zoom: 4
      }),
      target: nativeElement,
      controls: []
    });
  }
}
