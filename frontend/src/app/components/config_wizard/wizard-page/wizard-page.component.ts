import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import * as RiesgosActions from 'src/app/riesgos/riesgos.actions';
import { WizardableProduct } from '../wizardable_products';
import { getInputsForStep } from 'src/app/riesgos/riesgos.selectors';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { WizardableStep } from '../wizardable_steps';
import { RiesgosProduct } from 'src/app/riesgos/riesgos.state';
import { AugmenterService } from 'src/app/services/augmenter/augmenter.service';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent implements OnInit {

  @Input() step: WizardableStep;
  parameters$: Observable<WizardableProduct[]>;


  constructor(
    private store: Store<State>,
    private augmenter: AugmenterService
  ) { }

  ngOnInit() {
    this.parameters$ = this.store.pipe(
      select(getInputsForStep(this.step.step.id)),
      switchMap((inputs: RiesgosProduct[]) => {
        const tasks$ = inputs.map(i => this.augmenter.loadWizardPropertiesForProduct(this.step.scenario, i));
        return forkJoin(tasks$);
      })
    );
  }

  onReconfigureClicked() {
    this.store.dispatch(RiesgosActions.restartingFromStep({step: this.step.step.id}));
  }


}
