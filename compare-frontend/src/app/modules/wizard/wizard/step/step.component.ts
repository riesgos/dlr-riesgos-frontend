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
        case "selectEqChile":
          return "pointerRight";
        case "EqSimulation":
        case "EqSimulationChile":
          return "earthquake";
        case "Exposure":
        case "ExposureChile":
          return "exposure";
        case "EqDamage":
        case "EqDamageChile":
          return "buildingsEarthquake";
        case "Tsunami":
        case "TsunamiChile":
          return "tsunami";
        case "TsDamage":
        case "TsDamageChile":
          return "buildingsTsunami";
        case "SysRel":
        case "SysRelChile":
          return "sysrel";
        default: 
          return "questionmark"
    }
  }
}
