import { Component, Input, OnInit } from '@angular/core';
import { Partition, RiesgosProduct, RiesgosStep, ScenarioName } from 'src/app/state/state';
import { WizardComposite, WizardService } from '../../wizard.service';
import { Observable } from 'rxjs';

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

  public focus() {
    this.wizardSvc.stepSelect(this.scenario, this.partition, this.data.step.step.id);
  }
}
