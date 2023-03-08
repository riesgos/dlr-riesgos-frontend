import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RiesgosState, RiesgosStep } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent {
  
  @Input() step!: RiesgosStep;
  public focusedStep$ = this.store.select(state => {
    return state.riesgos.focusState.focusedStep;
  });

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  public focus() {
    this.store.dispatch(AppActions.stepSelect({ stepId: this.step.step.id }));
  }
}
