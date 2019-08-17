import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LayersService } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';

@Component({
  selector: 'ukis-layercontrol',
  templateUrl: './layercontrol.component.html',
  styleUrls: ['./layercontrol.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayercontrolComponent implements OnInit {

  constructor(
    public layersSvc: LayersService,
    public mapStateSvc: MapStateService
  ) { }

  ngOnInit() {
  }

}
