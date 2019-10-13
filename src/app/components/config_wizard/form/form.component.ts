import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { UserconfigurableProductDescription, UserconfigurableProduct, isBboxUconfProd } from '../userconfigurable_wpsdata';
import { WizardableProcess } from '../wizardable_processes';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ClickRunProcess, ProductsProvided } from 'src/app/wps/wps.actions';
import { Product } from 'src/app/wps/wps.datatypes';
import { isBbox } from '@ukis/services-wps/src/lib/wps_datatypes';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ukis-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input() process: WizardableProcess;
  @Input() parameters: UserconfigurableProduct[];
  @Input() disabled = false;  // <------------ @TODO: can we infer this from formgroup?
  public formGroup: FormGroup;

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
      if (isBboxUconfProd(parameter)) {
        const control = this.formGroup.get(parameter.uid);
        control.valueChanges.pipe( debounceTime(500) ).subscribe(newVal => {
          this.store.dispatch(new ProductsProvided({products: [{
            ...parameter,
            value: newVal
          }]}));
        });
      }
    }
  }

  onSubmitClicked() {
    for (const parameter of this.parameters) {
      const formControl = this.formGroup.get(parameter.uid);
      parameter.value = formControl.value;
    }
    this.store.dispatch(new ClickRunProcess({productsProvided: this.parameters, process: this.process }));
  }

}
