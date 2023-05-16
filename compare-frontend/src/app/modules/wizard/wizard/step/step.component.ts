import { Component, Input } from '@angular/core';
import { Partition, ScenarioName } from 'src/app/state/state';
import { WizardComposite, WizardService } from '../../wizard.service';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent {
  
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() data!: WizardComposite;

  constructor(private wizardSvc: WizardService) {}

  public toggleFocus() {
    this.wizardSvc.setStepFocus(this.scenario, this.partition, this.data.step.step.id, !this.data.hasFocus);
  }
}
