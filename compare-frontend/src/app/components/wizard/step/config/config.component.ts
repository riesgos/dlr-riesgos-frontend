import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RiesgosState, RiesgosStep } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  @Input() step!: RiesgosStep["step"];
  public formGroup: FormGroup = new FormGroup({});

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  ngOnInit(): void {
    for (const input of this.step.inputs) {
      this.formGroup.addControl(input.id, new FormControl(input.default || ''));
    }
  }

  public execute() {
    this.store.dispatch(AppActions.stepConfig({
      config: {
        stepId: this.step.id,
        values: this.formGroup.value
      } 
    }));
    setTimeout(() => {
      this.store.dispatch(AppActions.stepExecStart({ step: this.step.id }));
    }, 0);
  }
}
