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
      // Kind of flaky: 
      // We interpret any input with an options-array as user-configurable, 
      // and all others as outputs of upstream processes. 
      if (input.options) {
        const id = input.id;
        const existingValue = this.products.find(p => p.id === id)?.value;
        const existingRef = this.products.find(p => p.id === id)?.reference;
        const existingDefault = input.default;
        const firstOption = input.options[0];
        this.formGroup.addControl(id, new FormControl(existingValue || existingRef || existingDefault || firstOption || ''));
      }
    }

    if (this.requiresConfigAction()) {
      this.store.dispatch(AppActions.stepConfig({
          scenario: this.scenario,
          stepId: this.step.id,
          values: this.formGroup.value
      }));
    }

    this.formGroup.valueChanges.subscribe(newVal => {
      this.store.dispatch(AppActions.stepConfig({
          scenario: this.scenario,
          stepId: this.step.id,
          values: newVal
      }));
    });

  }

  public execute() {
    this.store.dispatch(AppActions.stepExecStart({ scenario: this.scenario, step: this.step.id }));
  }

  public allValuesSet(): boolean {
    for (const key in this.formGroup.value) {
      const value = this.formGroup.value[key];
      if (value === '' || value === undefined) return false;
    }
    return true;
  }

  public requiresConfigAction(): boolean {
    let requiresConfigAction = false;
    for (const input of this.step.inputs) {
      if (input.options) {
        const id = input.id;
        const existingValue = this.products.find(p => p.id === id)?.value;
        const existingDefault = input.default;
        if (!existingValue && existingDefault) {
          requiresConfigAction = true;
        }
      }
    }
    return requiresConfigAction;
  }
}
