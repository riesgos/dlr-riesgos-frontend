import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as Cesium from 'cesium/Build/Cesium/Cesium';
window['CESIUM_BASE_URL'] = '/assets/cesium';
Cesium.buildModuleUrl.setBaseUrl('/assets/cesium/');
window['Cesium'] = Cesium; // expose Cesium to the OL-Cesium library
import "cesium/Build/Cesium/Widgets/widgets.css";
import OLCesium from 'ol-cesium';
import { LayersService } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { MapOlService } from '@ukis/map-ol';

@Component({
  selector: 'ukis-map-ol-cesium',
  templateUrl: './cesiummap.component.html',
  styleUrls: ['./cesiummap.component.css']
})
export class CesiummapComponent implements OnInit, AfterViewInit {

  @Input() layersSvc: LayersService;
  @Input() mapState: MapStateService;
  @Input() controls;
  public cesiumOn = false;
  private ol3d;

  constructor(
    private mapSvc: MapOlService
    ) { }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
      this.ol3d = new OLCesium({map: this.mapSvc.map});
      const scene = this.ol3d.getCesiumScene();
      scene.terrainProvider = Cesium.createWorldTerrain({});
      this.ol3d.setEnabled(this.cesiumOn);
    }

    toggleView() {
      this.cesiumOn = !this.cesiumOn;
      this.ol3d.setEnabled(this.cesiumOn);
    }
}
