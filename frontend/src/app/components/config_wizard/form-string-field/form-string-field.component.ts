import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { StringUserConfigurableProduct } from '../wizardable_products';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { debounceTime } from 'rxjs/operators';
import { userDataProvided } from 'src/app/riesgos/riesgos.actions';
import { ScenarioName } from 'src/app/riesgos/riesgos.state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ukis-form-string-field',
  templateUrl: './form-string-field.component.html',
  styleUrls: ['./form-string-field.component.css'],
})
export class FormStringFieldComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() control: UntypedFormControl;
  @Input() scenario: ScenarioName;
  @Input() parameter: StringUserConfigurableProduct;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  private subscription: Subscription;

  constructor(private store: Store<State>) {}

  ngOnDestroy(): void {
    // prevents new subscription on every rebuild
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // prevents input field from losing focus when state-change causes rebuild.
    if (this.control.dirty) {
      this.input.nativeElement.focus();
    }
  }

  ngOnInit() {
    this.subscription = this.control.valueChanges.subscribe(val => {
      if(this.control.valid && this.control.value !== this.parameter.value) {
        console.log(`new control value: control: ${this.control.value}, para: ${this.parameter.value}`)
        this.store.dispatch(userDataProvided({
          scenario: this.scenario,
          products: [{
            ... this.parameter,
            value: this.control.value
          }]
        }));
      }
    })
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
