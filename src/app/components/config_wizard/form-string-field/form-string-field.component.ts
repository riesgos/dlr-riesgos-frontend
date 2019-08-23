import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { StringUconfWD, StringUconfWpsData } from '../userconfigurable_wpsdata';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { ProductsProvided } from 'src/app/wps/wps.actions';
import { convertWpsDataToProds } from 'src/app/wps/wps.selectors';

@Component({
  selector: 'ukis-form-string-field',
  templateUrl: './form-string-field.component.html',
  styleUrls: ['./form-string-field.component.css'],
})
export class FormStringFieldComponent implements OnInit {


  @Input() parameter: StringUconfWpsData;
  formControl: FormControl;

  constructor(private store: Store<State>) {}
  
  ngOnInit() {
    this.formControl = new FormControl(this.parameter.value || this.parameter.description.defaultValue, [Validators.required]);
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

  onFocussed(focussed: boolean): void {
    if (!focussed) {
      this.store.dispatch(new ProductsProvided({
        products: convertWpsDataToProds([{
          ...this.parameter,
          value: this.formControl.value
        }])
      }));
    }
  }

}
