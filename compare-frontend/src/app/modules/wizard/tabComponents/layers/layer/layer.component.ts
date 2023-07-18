import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { mapLayerVisibility } from 'src/app/state/actions';
import { PartitionName, RiesgosState, ScenarioName } from 'src/app/state/state';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent {

  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() layerId!: string;
  @Input() layerVisibility!: boolean;

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  showLayer() {
    this.store.dispatch(mapLayerVisibility({ scenario: this.scenario, partition: this.partition, layerId: this.layerId, visible: true }));
  }

  hideLayer() {
    this.store.dispatch(mapLayerVisibility({ scenario: this.scenario, partition: this.partition, layerId: this.layerId, visible: false }));
  }

  toggleVisibility() {
    this.store.dispatch(mapLayerVisibility({ scenario: this.scenario, partition: this.partition, layerId: this.layerId, visible: !this.layerVisibility }));
  }
}
