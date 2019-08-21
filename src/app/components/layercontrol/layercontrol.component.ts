import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { LayersService } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';

@Component({
  selector: 'ukis-layercontrol',
  templateUrl: './layercontrol.component.html',
  styleUrls: ['./layercontrol.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayercontrolComponent implements OnInit {

  @Input() expandedResults = false;
  @Input() expandedLayers = true;
  constructor(
    public layersSvc: LayersService,
    public mapStateSvc: MapStateService
  ) { }

  ngOnInit() {
  }

}
