import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UserConfigurableProduct, isBboxUserConfigurableProduct } from '../userconfigurable_wpsdata';
import { WizardableStep } from '../wizardable_steps';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import * as RiesgosActions from 'src/app/riesgos/riesgos.actions';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ukis-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

  @Input() step: WizardableStep;
  @Input() parameters: UserConfigurableProduct[];
  @Input() disabled = false;  // <------------ @TODO: can we infer this from formgroup?
  public formGroup: UntypedFormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    const controls = {};

    for (const parameter of this.parameters) {
      const key = parameter.uid;
      const startValue = parameter.value || parameter.description.defaultValue || null;
      controls[key] = new UntypedFormControl(startValue, [Validators.required]);
    }

    this.formGroup = new UntypedFormGroup(controls);

    for (const parameter of this.parameters) {
      if (isBboxUserConfigurableProduct(parameter)) {
        const control = this.formGroup.get(parameter.uid);
        const sub$ = control.valueChanges.subscribe(newVal => {
          if (control.valid) {
            this.store.dispatch(RiesgosActions.userDataProvided({
              scenario: this.step.scenario,
              products: [{
                ...parameter,
                value: newVal
              }]
            }));
          }
        });
        this.subscriptions.push(sub$);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map(s => s.unsubscribe());
  }

  onSubmitClicked() {
    this.store.dispatch(RiesgosActions.executeStart({
      scenario: this.step.scenario,
      step: this.step.step.id
    }));
  }

}
