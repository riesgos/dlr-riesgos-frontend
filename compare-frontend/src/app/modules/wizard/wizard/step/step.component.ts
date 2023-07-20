import { Component, Input } from '@angular/core';
import { PartitionName, RiesgosState, ScenarioName } from 'src/app/state/state';
import { StepState } from '../wizard.types';
import { Store } from '@ngrx/store';
import * as Actions from 'src/app/state/actions';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent {
  
  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() data!: StepState;

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  public toggleFocus() {
    this.store.dispatch(Actions.stepSetFocus({scenario: this.scenario, partition: this.partition, stepId: this.data.stepId, focus: !this.data.hasFocus }));
  }
}
