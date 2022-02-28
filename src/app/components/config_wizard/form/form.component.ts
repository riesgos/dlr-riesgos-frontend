import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { UserConfigurableProductDescription, UserConfigurableProduct, isBboxUserConfigurableProduct } from '../userconfigurable_wpsdata';
import { WizardableProcess } from '../wizardable_processes';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ClickRunProcess, ProductsProvided } from 'src/app/riesgos/riesgos.actions';
import { Product } from 'src/app/riesgos/riesgos.datatypes';
import { isBbox } from 'src/app/services/wps';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ukis-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  @Input() process: WizardableProcess;
  @Input() parameters: UserConfigurableProduct[];
  @Input() disabled = false;  // <------------ @TODO: can we infer this from formgroup?
  public formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    const controls = {};

    for (const parameter of this.parameters) {
      const key = parameter.uid;
      const startValue = parameter.value || parameter.description.defaultValue || null;
      controls[key] = new FormControl(startValue, [Validators.required]);
    }

    this.formGroup = new FormGroup(controls);

    for (const parameter of this.parameters) {
      if (isBboxUserConfigurableProduct(parameter)) {
        const control = this.formGroup.get(parameter.uid);
        const sub$ = control.valueChanges.pipe( debounceTime(500) ).subscribe(newVal => {
          if (control.valid) {
            this.store.dispatch(new ProductsProvided({products: [{
              ...parameter,
              value: newVal
            }]}));
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
    for (const parameter of this.parameters) {
      const formControl = this.formGroup.get(parameter.uid);
      parameter.value = formControl.value;
    }
    this.store.dispatch(new ClickRunProcess({productsProvided: this.parameters, process: this.process }));
  }

}
