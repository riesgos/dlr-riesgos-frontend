import { Component, Input } from '@angular/core';
import { Partition, RiesgosProduct, RiesgosStep, ScenarioName } from 'src/app/state/state';
import { WizardService } from 'src/app/services/dataToUi/dataToWizard';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent {
  
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() step!: RiesgosStep;
  @Input() inputs!: RiesgosProduct[];
  @Input() outputs!: RiesgosProduct[];

  public focusedStep$ = this.wizardSvc.getFocussedStep(this.scenario, this.partition);

  constructor(private wizardSvc: WizardService) {}

  public focus() {
    this.wizardSvc.stepSelect(this.scenario, this.partition, this.step.step.id);
  }
}
