import { Component, OnInit, Input , forwardRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StringUconfWD } from '../userconfigurable_wpsdata';

@Component({
  selector: 'ukis-form-string-field',
  templateUrl: './form-string-field.component.html',
  styleUrls: ['./form-string-field.component.css'],
  providers: [{ 
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FormStringFieldComponent),
    }]
})
export class FormStringFieldComponent implements OnInit, ControlValueAccessor {


  @Input() formControl: FormControl;
  @Input() parameter: StringUconfWD;
  public value: string;
  public valid: Observable<boolean>;
  public disabled: boolean = false;
  private changeFunction; 

  constructor() { }

  ngOnInit() {
    //console.log(`${this.parameter.id} string field init`);
    this.valid = this.formControl.statusChanges.pipe(
      map((state) => {
        if(state == "VALID") return true;
        else return false;
      })
    );
  }

  writeValue(obj: any): void {
    //console.log(`${this.parameter.id} writeValue`, obj);
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.changeFunction = fn; 
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    //console.log(`${this.parameter.id} setDisabledState`, isDisabled);
    this.disabled = isDisabled;
  }

  onChange(event) {
    //console.log("calling change funciton with ", event);
    this.changeFunction(event);
  }

}
