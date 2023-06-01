import { Component, Input, OnInit } from '@angular/core';
import { ScenarioName, Partition } from 'src/app/state/state';
import { WizardComposite } from '../../wizard.service';
import { StepStateError } from 'src/app/state/state';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;
  public message: any = {};


  ngOnInit(): void {
    if (this.data.step.state.type === 'error') {
      this.message = JSON.parse((this.data.step.state as StepStateError).message);
    }
  }
}
