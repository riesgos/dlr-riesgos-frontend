import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Partition, RiesgosProduct, RiesgosState, RiesgosStep, ScenarioName } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent {
  
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() step!: RiesgosStep;
  @Input() inputs!: RiesgosProduct[];
  @Input() outputs!: RiesgosProduct[];

  public focusedStep$ = this.store.select(state => {
    return state.riesgos.focusState.focusedStep;
  });

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  public focus() {
    this.store.dispatch(AppActions.stepSelect({ stepId: this.step.step.id }));
  }
}
