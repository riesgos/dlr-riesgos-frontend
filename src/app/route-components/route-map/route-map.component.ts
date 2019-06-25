import { Component, OnInit, AfterViewInit, HostBinding, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { LayersService, RasterLayer, VectorLayer } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { MapOlService } from '@ukis/map-ol';

@Component({
  selector: 'ukis-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.scss'],
  host: { "[class.content-container]": "true" }, // <-- required for clarity-layout
  changeDetection: ChangeDetectionStrategy.OnPush,  // <--  required so that ol does not continually refresh
  providers: [LayersService, MapStateService, MapOlService], // <-- required for MapOlService to be constructed when the page is loaded. otherwise no canvas-element created. 
  encapsulation: ViewEncapsulation.None, // <-- required so that we can overwrite the #map style to "width:unset;" (otherwise map distorted when moving from scenarios to map)

})
export class RouteMapComponent implements OnInit {

  @HostBinding('class') class = 'content-container';
  controls: { attribution?: boolean, scaleLine?: boolean, zoom?: boolean, crosshair?: boolean };

  constructor(
      public layersSvc: LayersService,
      public mapStateSvc: MapStateService,
      public mapSvc: MapOlService
      ) {
      this.controls = { attribution: true, scaleLine: true };
  }
  ngOnInit() {
  }

}
