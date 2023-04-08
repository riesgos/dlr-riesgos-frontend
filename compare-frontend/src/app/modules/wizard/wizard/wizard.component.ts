import { Component, Input, OnInit } from '@angular/core';
import { Partition, ScenarioName } from 'src/app/state/state';
import { Observable, tap } from 'rxjs';
import { StepData, WizardService } from '../wizard.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() focus!: boolean;
  public stepData$!: Observable<StepData[]>;


  constructor(
    private wizardSvc: WizardService
  ) {}

  ngOnInit(): void {
    this.stepData$ = this.wizardSvc.getStepData(this.scenario, this.partition);
  }

  public toggleFocus() {
    this.wizardSvc.toggleFocus(this.scenario, this.partition);
  }
}
