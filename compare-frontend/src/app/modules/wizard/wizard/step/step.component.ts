import { Component, Input } from '@angular/core';
import { PartitionName, ScenarioName } from 'src/app/state/state';
import { StepState } from '../wizard.types';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent {
  
  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() data!: StepState;

  constructor() {}

  public toggleFocus() {
    throw new Error('undefinf');
  }
}
