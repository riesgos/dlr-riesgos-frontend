import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectUconfWD } from '../userconfigurable_wpsdata';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted, InteractionCompleted } from 'src/app/interactions/interactions.actions';

@Component({
  selector: 'ukis-form-select-field',
  templateUrl: './form-select-field.component.html',
  styleUrls: ['./form-select-field.component.css'], 
  providers: [{ 
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => FormSelectFieldComponent),
  }]
})
export class FormSelectFieldComponent implements OnInit, ControlValueAccessor {

  @Input() parameter: SelectUconfWD;
  public disabled: boolean = false;
  private options: {[k: string]: any};
  public selectionStrings: string[]; 
  public activeSelection: string;
  private changeFunction; 


  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.options = this.parameter.wizardProperties.options;
    this.selectionStrings = Object.keys(this.options);
  }

  writeValue(obj: any): void {
    //console.log(`${this.parameter.id} writeValue`, obj);
    this.activeSelection = this.getObjectKey(obj);
  }

  registerOnChange(fn: any): void {
    //console.log(`${this.parameter.id} registering change function `, fn);
    this.changeFunction = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    //console.log(`${this.parameter.id} setDisabledState`, isDisabled);
    this.disabled = isDisabled;
  }

  onChange(newValString) {
    const newVal = this.options[newValString];
    //console.log("calling changefunction with ", newVal);
    this.changeFunction(newVal);
    this.store.dispatch(new InteractionCompleted({product: {description: this.parameter, value: newVal}}))
  }

  onClick(event) {
    this.store.dispatch(new InteractionStarted({
      mode: "featureselection", 
      product: {
          description: this.parameter, 
          value: this.activeSelection
      }
  }))
  }


  private getObjectKey(obj): string {
    return obj.id;
  }
}
