import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { mapLayerOpacity } from 'src/app/state/actions';
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
  @Input() layerOpacity!: number;

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  showLayer() {
    this.store.dispatch(mapLayerOpacity({ scenario: this.scenario, partition: this.partition, layerCompositeId: this.layerCompositeId, opacity: 1.0 }));
  }

  hideLayer() {
    this.store.dispatch(mapLayerOpacity({ scenario: this.scenario, partition: this.partition, layerCompositeId: this.layerCompositeId, opacity: 0.0 }));
  }

}
