import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { WizardService, WizardState } from '../wizard.service';
import { Store } from '@ngrx/store';
import * as Actions from "src/app/state/actions";
import { ScenarioName, Partition } from 'src/app/state/state';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.css']
})
export class ControlButtonsComponent {

  @Input() scenario!: ScenarioName;
  @Input() partition!: Partition;
  @Input() focus!: boolean;
  public zoomingToStep$ = new BehaviorSubject<boolean>(false);

  constructor(
    private wizardSvc: WizardService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.wizardSvc.getWizardState(this.scenario, this.partition).pipe(map(v => v.zoomingToSelectedStep)).subscribe(this.zoomingToStep$);
  }

  public refreshClicked() {
    this.store.dispatch(Actions.stepResetAll({scenario: this.scenario, partition: this.partition}));
  }

  public zoomClicked(evt: Event) {
    evt.preventDefault();
    this.store.dispatch(Actions.setZoomToStep({scenario: this.scenario, partition: this.partition, zoomToStep: !this.zoomingToStep$.value}));
  }
}
