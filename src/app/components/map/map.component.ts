import { Component, OnInit, ViewEncapsulation, HostBinding, AfterViewInit } from '@angular/core';
import { get as getProjection } from 'ol/proj.js';
import { LayersService, RasterLayer } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { osm } from '@ukis/base-layers-raster';
import { MapOlService } from '@ukis/map-ol';

@Component({
  
  selector: 'ukis-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None, // <-- required so that we can overwrite the #map style to "width:unset;" (otherwise map distorted when moving from scenarios to map)
})
export class MapComponent implements OnInit, AfterViewInit {

  
  controls: { attribution?: boolean, scaleLine?: boolean, zoom?: boolean, crosshair?: boolean };

  constructor(
      public layersSvc: LayersService,
      public mapStateSvc: MapStateService,
      public mapSvc: MapOlService
      ) {
      this.controls = { attribution: true, scaleLine: true };
  }

  ngOnInit() {

    let osmLayer = new osm();
        osmLayer.visible = true;
        this.layersSvc.addLayer(osmLayer, 'Layers');

        let powerlineLayer = new RasterLayer({
            id: "powerlines", 
            name: "Powerlines", 
            type: "wms", 
            url: "http://sig.minenergia.cl/geoserver/men/wms?",
            params: {
                "LAYERS": "men:lt_sic_728861dd_ef2a_4159_bac9_f5012a351115"
            }, 
            visible: false
        });
        this.layersSvc.addLayer(powerlineLayer, "Layers");

        let relief = new RasterLayer({
            id: "shade", 
            name: "Hillshade", 
            type: "wms", 
            url: "https://ows.terrestris.de/osm/service?",
            params: {
                "LAYERS": "SRTM30-Hillshade", 
                "TRANSPARENT": true, 
                "FORMAT": "image/png"
            }, 
            opacity: 0.3,
            visible: false
        });
        this.layersSvc.addLayer(relief, "Layers");


  }

  ngAfterViewInit() {
    this.mapSvc.setCenter([-70.799,-33.990]);
    this.mapSvc.setZoom(8);
    this.mapSvc.setProjection(getProjection('EPSG:4326'));
}

}
