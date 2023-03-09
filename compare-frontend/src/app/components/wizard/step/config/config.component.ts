import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RiesgosProduct, RiesgosState, RiesgosStep, ScenarioName } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  @Input() scenario!: ScenarioName;
  @Input() step!: RiesgosStep["step"];
  @Input() products!: RiesgosProduct[];
  public formGroup: FormGroup = new FormGroup({});

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  ngOnInit(): void {
    for (const input of this.step.inputs) {
      const id = input.id;
      const existingValue = this.products.find(p => p.id === id)?.value;
      const existingDefault = input.default;
      this.formGroup.addControl(id, new FormControl(existingValue || existingDefault || ''));
    }

    this.formGroup.valueChanges.subscribe(newVal => {
      this.store.dispatch(AppActions.stepConfig({
        config: {
          stepId: this.step.id,
          values: newVal
        } 
      }));
    })
  }

  public execute() {
    this.store.dispatch(AppActions.stepExecStart({ scenario: this.scenario, step: this.step.id }));
  }
}
