import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Partition, RiesgosState, ScenarioName } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';
import { Store } from '@ngrx/store';
import { WizardComposite } from '../../../wizard.service';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;
  public formGroup: FormGroup = new FormGroup({});

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  ngOnInit(): void {
    for (const input of this.data.inputs) {
      if (input.options) {
        const existingValue = input.currentValue;
        // const firstOption = input.options[0];  // when first option is set as a default value from the start, no config-action is fired, causing error when hitting "execute" without selecting another option.
        this.formGroup.addControl(input.productId, new FormControl(existingValue || ''));
      }
    }

    // if (this.onInitRequiresConfig()) {
    //   console.log(`step config from wizard/requiresConfigAction`)
    //   this.store.dispatch(AppActions.stepConfig({
    //       scenario: this.scenario,
    //       partition: this.partition,
    //       stepId: this.data.step.step.id,
    //       values: this.formGroup.value
    //   }));
    // }

    this.formGroup.valueChanges.subscribe(newVal => {
      console.log(`step config from wizard/valueChanges`)
      this.store.dispatch(AppActions.stepConfig({
          scenario: this.scenario,
          partition: this.partition,
          stepId: this.data.step.step.id,
          values: newVal
      }));
    });

  }

  public execute() {
    this.store.dispatch(AppActions.stepExecStart({ scenario: this.scenario, partition: this.partition, step: this.data.step.step.id }));
  }

  public allValuesSet(): boolean {
    for (const key in this.formGroup.value) {
      const value = this.formGroup.value[key];
      if (value === '' || value === undefined) return false;
    }
    return true;
  }

  // private onInitRequiresConfig(): boolean {
  //   let requiresConfigAction = false;
  //   for (const input of this.data.inputs) {
  //     if (input.options) {
  //       const existingValue = input.currentValue;
  //       if (!existingValue) {
  //         requiresConfigAction = true;
  //       }
  //     }
  //   }
  //   return requiresConfigAction;
  // }
}
