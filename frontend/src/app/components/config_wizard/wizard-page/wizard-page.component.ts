import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import * as RiesgosActions from 'src/app/riesgos/riesgos.actions';
import { WizardableProduct } from '../wizardable_products';
import { getInputsForStep } from 'src/app/riesgos/riesgos.selectors';
import { map, switchMap, take } from 'rxjs/operators';
import { forkJoin, Observable, timer } from 'rxjs';
import { WizardableStep } from '../wizardable_steps';
import { AugmenterService } from 'src/app/services/augmenter/augmenter.service';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent implements OnInit {

  @Input() step: WizardableStep;
  parameters$: Observable<WizardableProduct[]>;

  // reconfigure button only active after a second, so users can't click it accidentally.
  reconfigButtonDisabled$ = timer(0, 1000).pipe(
    take(2),
    map(v => {
      if (v === 0) return true;
      return false;
    })
  );

  constructor(
    private store: Store<State>,
    private augmenter: AugmenterService
  ) { }

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getInputsForStep(this.step.step.id)),
      switchMap(inputs => this.augmenter.loadWizardPropertiesForProducts(inputs))
    );
  }

  onReconfigureClicked() {
    this.store.dispatch(RiesgosActions.restartingFromStep({step: this.step.step.id}));
  }


}
