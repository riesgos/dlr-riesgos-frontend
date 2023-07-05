import { Observable, scan, tap } from 'rxjs';
import { Partition, ScenarioName } from 'src/app/state/state';

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { WizardComposite, WizardService, WizardState } from '../wizard.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() focus!: boolean;
  public state$!: Observable<WizardState>;

  constructor(
    private wizardSvc: WizardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.state$ = this.wizardSvc.getWizardState(this.scenario, this.partition);
  }

  public toggleFocus() {
    this.wizardSvc.toggleFocus(this.scenario, this.partition);
  }

  public trackByFn(index: number, item: WizardComposite) {
    return `${item.step.step.id}-${item.step.state.type}-${JSON.stringify(item.inputs)}`;
  }
}
