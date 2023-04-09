import { Component, Input, OnInit } from '@angular/core';
import { Partition, RiesgosProduct, RiesgosStep, ScenarioName } from 'src/app/state/state';
import { WizardService } from '../../wizard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {
  
  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() step!: RiesgosStep;
  @Input() inputs!: RiesgosProduct[];
  @Input() outputs!: RiesgosProduct[];

  public focusedStep$!: Observable<string | undefined>;

  constructor(private wizardSvc: WizardService) {}

  ngOnInit(): void {
    this.focusedStep$ = this.wizardSvc.getFocussedStep(this.scenario, this.partition);
  }

  public focus() {
    this.wizardSvc.stepSelect(this.scenario, this.partition, this.step.step.id);
  }
}
