import { AfterViewInit, Component, Input } from '@angular/core';
import { Partition, RiesgosScenarioMapState, RiesgosState, ScenarioName } from 'src/app/state/state';
import { WizardComposite } from '../../wizard.service';
import { Store } from '@ngrx/store';
import { mapLayerVisibility } from 'src/app/state/actions';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent implements AfterViewInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  ngAfterViewInit(): void {
    if (this.data.oneLayerOnly) {
      const nrLayersVisible = this.data.layerControlables.filter(lc => lc.visible).length;
      if (nrLayersVisible > 1) {
        const firstCompositeId = this.data.layerControlables[0].id;
        this.onLayerVisibilityChanged({layerCompositeId: firstCompositeId, visible: true});
      }
    }
  }



  public onLayerVisibilityChanged($event: {layerCompositeId: string, visible: boolean}) {
    const configs: RiesgosScenarioMapState["layerSettings"] = this.data.layerControlables.map(d => {

      let visible = d.visible;
      if ($event.layerCompositeId === d.id) visible = $event.visible;
      if (this.data.oneLayerOnly && $event.layerCompositeId !== d.id) visible = false;

      return { layerCompositeId: d.id, stepId: d.stepId, visible };
    });

    this.store.dispatch(mapLayerVisibility({
      scenario: this.scenario,
      partition: this.partition, 
      stepId: this.data.step.step.id,
      config: configs
    }));
  }

}
