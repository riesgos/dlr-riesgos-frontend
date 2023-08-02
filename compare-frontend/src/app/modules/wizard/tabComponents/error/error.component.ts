import { Component, Input, OnInit } from '@angular/core';
import { ScenarioName, Partition, RiesgosState } from 'src/app/state/state';
import { WizardComposite } from '../../wizard.service';
import { StepStateError } from 'src/app/state/state';
import { Store } from '@ngrx/store';
import { stepReset } from 'src/app/state/actions';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;
  public message = "";

  constructor(private store: Store<{riesgos: RiesgosState}>) {}

  ngOnInit(): void {
    if (this.data.step.state.type === 'error') {
      let message = (this.data.step.state as StepStateError).message;
      if (typeof message === "string") {
        message = message.replace(String.raw`\n`, "<br/>");
        message = message.replace(String.raw`\\`, "");
      }
      if (typeof message !== "string") {
        message = JSON.parse(message);
      }
      this.message = message;
    }
  }

  public retry() {
    this.store.dispatch(stepReset({scenario: this.scenario, partition: this.partition, stepId: this.data.step.step.id }));
  }
}
