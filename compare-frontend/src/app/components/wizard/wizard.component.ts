import { Component, Input, OnInit } from '@angular/core';
import { Partition, ScenarioName } from 'src/app/state/state';
import { WizardService, StepData } from 'src/app/services/dataToUi/dataToWizard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() focus!: boolean;
  public stepData$ = this.wizardSvc.getStepData(this.scenario, this.partition);


  constructor(
    private wizardSvc: WizardService
  ) {}

  public toggleFocus() {
    this.wizardSvc.toggleFocus(this.scenario, this.partition);
  }
}
