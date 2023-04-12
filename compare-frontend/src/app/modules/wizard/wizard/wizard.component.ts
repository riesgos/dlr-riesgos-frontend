import { Observable } from 'rxjs';
import { Partition, ScenarioName } from 'src/app/state/state';

import { Component, Input, OnInit } from '@angular/core';

import { WizardService, WizardState } from '../wizard.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() focus!: boolean;
  public state!: Observable<WizardState>;


  constructor(
    private wizardSvc: WizardService
  ) {}

  ngOnInit(): void {
    this.state = this.wizardSvc.getWizardState(this.scenario, this.partition);
  }

  public toggleFocus() {
    this.wizardSvc.toggleFocus(this.scenario, this.partition);
  }
}
