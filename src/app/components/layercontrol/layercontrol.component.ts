import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { LayersService } from '@dlr-eoc/services-layers';
import { MapStateService } from '@dlr-eoc/services-map-state';

@Component({
  selector: 'ukis-layercontrol',
  templateUrl: './layercontrol.component.html',
  styleUrls: ['./layercontrol.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayercontrolComponent implements OnInit {
  @Input() navExpanded = true;
  @Input() expandedResults = true;
  @Input() expandedLayers = true;
  constructor(
    public layersSvc: LayersService,
    public mapStateSvc: MapStateService
  ) { }

  ngOnInit() {
  }

}
