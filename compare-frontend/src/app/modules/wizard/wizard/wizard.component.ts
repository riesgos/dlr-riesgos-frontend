import { Observable, tap } from 'rxjs';
import { Partition, ScenarioName } from 'src/app/state/state';

import { Component, Input, OnInit } from '@angular/core';

import { WizardComposite, WizardService, WizardState } from '../wizard.service';
import { Store } from '@ngrx/store';
import * as Actions from 'src/app/state/actions';

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
    private store: Store
  ) {}

  ngOnInit(): void {
    this.state$ = this.wizardSvc.getWizardState(this.scenario, this.partition);
  }

  public toggleFocus() {
    this.wizardSvc.toggleFocus(this.scenario, this.partition);
  }

  public trackByFn(index: number, item: WizardComposite) {
    const key = `${item.step.step.id}-${item.step.state.type}-${JSON.stringify(item.inputs)}-${item.layerControlables.filter(c => c.visible).length}`;
    return key;
  }

  public expandWizard() {
    this.store.dispatch(Actions.toggleWizard({ scenario: this.scenario, partition: this.partition, expand: true }));
  }

  public hideWizard() {
    this.store.dispatch(Actions.toggleWizard({ scenario: this.scenario, partition: this.partition, expand: false }));
  }

}
