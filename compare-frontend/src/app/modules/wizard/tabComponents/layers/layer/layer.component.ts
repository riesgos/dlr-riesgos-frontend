import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { mapLayerVisibility } from 'src/app/state/actions';
import { Partition, RiesgosState, ScenarioName } from 'src/app/state/state';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() stepId!: string;
  @Input() layerCompositeId!: string;
  @Input() layerVisibility!: boolean;
  @Output() layerVisibilityChanged = new EventEmitter();

  constructor() {}

  showLayer() {
    this.layerVisibilityChanged.emit({layerCompositeId: this.layerCompositeId, visible: true});
  }

  hideLayer() {
    this.layerVisibilityChanged.emit({layerCompositeId: this.layerCompositeId, visible: false});
  }

  toggleVisibility() {
    this.layerVisibilityChanged.emit({layerCompositeId: this.layerCompositeId, visible: !this.layerVisibility });
  }
}
