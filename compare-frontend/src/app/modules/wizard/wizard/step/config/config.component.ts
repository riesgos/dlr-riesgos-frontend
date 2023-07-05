import { Component, Input, OnInit } from '@angular/core';
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
  @Input() autoPilot!: boolean | undefined;
  private allValues: { [key: string]: any } = {}

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  ngOnInit(): void {
    for (const input of this.data.inputs) {
      this.allValues[input.productId] = input.currentValue;
    }
  }

  public select(productId: string, value: any) {
    this.allValues[productId] = value;

    this.store.dispatch(AppActions.stepConfig({
      scenario: this.scenario,
      partition: this.partition,
      stepId: this.data.step.step.id,
      values: this.allValues
  }));
  }

  public execute() {
    this.store.dispatch(AppActions.stepExecStart({ scenario: this.scenario, partition: this.partition, step: this.data.step.step.id }));
  }

  public allValuesSet(): boolean {
    for (const [key, value] of Object.entries(this.allValues)) {
      if (value === '' || value === undefined) return false;
    }
    return true;
  }

  public isSelected(productId: string, option: {key: string, value: any}) {
    const triedValue = option.value;
    const actualValue = this.allValues[productId];
    // if (this.data.inputs.find(i => i.productId === productId).valueToKey() === option.key) return true;
    const matches = triedValue === actualValue || JSON.stringify(triedValue) === actualValue || triedValue === JSON.stringify(actualValue) || JSON.stringify(triedValue) === JSON.stringify(actualValue);
    return matches;
  }

  public onKey(productId: string, event: any) {
    console.error("config.component.onkey: Not yet implemented")
  }

}
