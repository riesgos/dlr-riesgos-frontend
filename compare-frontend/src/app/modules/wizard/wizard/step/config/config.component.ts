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
        this.formGroup.addControl(input.productId, new FormControl(existingValue || ''));
      }
    }

    this.formGroup.valueChanges.subscribe(newVal => {
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

  public isSelected(productId: string, option: {key: string, value: any}) {
    const triedValue = option.value;
    const actualValue = this.formGroup.controls[productId].value;
    const matches = JSON.stringify(triedValue) === JSON.stringify(actualValue);
    // console.log(`isselected: `, productId, option, matches)
  }

}
