import { Component, Input, OnInit } from '@angular/core';
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
  @Input() layerCompositeId!: string;
  @Input() layerVisibility!: boolean;

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  showLayer() {
    this.store.dispatch(mapLayerVisibility({ scenario: this.scenario, partition: this.partition, layerCompositeId: this.layerCompositeId, visible: true }));
  }

  hideLayer() {
    this.store.dispatch(mapLayerVisibility({ scenario: this.scenario, partition: this.partition, layerCompositeId: this.layerCompositeId, visible: false }));
  }

  toggleVisibility() {
    this.store.dispatch(mapLayerVisibility({ scenario: this.scenario, partition: this.partition, layerCompositeId: this.layerCompositeId, visible: !this.layerVisibility }));
  }
}
