import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { LayersService } from '@ukis/services-layers';
import { MapStateService } from '@ukis/services-map-state';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'ukis-layercontrol',
  templateUrl: './layercontrol.component.html',
  styleUrls: ['./layercontrol.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class LayercontrolComponent implements OnInit {
  @Input() navExpanded = true;
  @Input() expandedResults = false;
  @Input() expandedLayers = true;
  constructor(
    public layersSvc: LayersService,
    public mapStateSvc: MapStateService
  ) { }

  ngOnInit() {
  }

}
