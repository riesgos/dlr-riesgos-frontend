import { Component, Input } from '@angular/core';
import { PartitionName, ScenarioName } from 'src/app/state/state';
import { WizardComposite, WizardService } from '../../wizard.service';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent {
  
  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() data!: WizardComposite;

  constructor(private wizardSvc: WizardService) {}

  public toggleFocus() {
    this.wizardSvc.setStepFocus(this.scenario, this.partition, this.data.step.step.id, !this.data.hasFocus);
  }

  public getIconNameFor(stepId: string) {
    switch(stepId) {
        case "selectEq":
          return "pointerRight";
        case "EqSimulation":
          return "earthquake";
        case "Exposure":
          return "exposure";
        case "EqDamage":
          return "buildingsEarthquake";
        case "Tsunami":
          return "tsunami";
        case "TsDamage":
          return "buildingsTsunami";
        case "SysRel":
          return "sysrel";
        default: 
          return "questionmark"
    }
  }
}
