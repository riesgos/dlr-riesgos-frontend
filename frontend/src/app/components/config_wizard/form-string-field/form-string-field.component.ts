import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { StringUserConfigurableProduct } from '../userconfigurable_wpsdata';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';

@Component({
  selector: 'ukis-form-string-field',
  templateUrl: './form-string-field.component.html',
  styleUrls: ['./form-string-field.component.css'],
})
export class FormStringFieldComponent implements OnInit {

  @Input() control: UntypedFormControl;
  @Input() parameter: StringUserConfigurableProduct;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    // this.formControl.valueChanges.pipe(
    //   debounceTime(1500),
    // ).subscribe(val => {
    //   if(this.formControl.valid) {
    //     this.store.dispatch(new ProductsProvided({
    //       products: [{
    //         ...this.parameter,
    //         value: val
    //       }]
    //     }))
    //   }
    // })
  }

  // onFocussed(focussed: boolean): void {
  //   if (!focussed) {
  //     this.store.dispatch(new ProductsProvided({
  //       products: [{
  //         ...this.parameter,
  //         value: this.formControl.value
  //       }]
  //     }));
  //   }
  // }

}
