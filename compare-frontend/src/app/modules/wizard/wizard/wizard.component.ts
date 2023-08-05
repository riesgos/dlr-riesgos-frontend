import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { PartitionName, RiesgosState, ScenarioName } from 'src/app/state/state';

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
  @Input() partition!: PartitionName;
  @Input() focus!: boolean;
  public state$!: Observable<WizardState>;
  private __currentRiesgosState = new BehaviorSubject<RiesgosState | undefined>(undefined);


  constructor(
    private wizardSvc: WizardService,
    private store: Store<{riesgos: RiesgosState}>
  ) {
    this.store.select(s => s.riesgos).subscribe(this.__currentRiesgosState);
  }

  ngOnInit(): void {
    this.state$ = this.wizardSvc.getWizardState(this.scenario, this.partition).pipe(
      map(state => {
        return state;
      })
    );
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
