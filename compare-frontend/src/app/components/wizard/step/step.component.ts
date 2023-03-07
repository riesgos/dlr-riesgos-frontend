import { Component, Input } from '@angular/core';
import { RiesgosStep, StepState } from 'src/app/state/state';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent {
  @Input() step!: RiesgosStep;
}
