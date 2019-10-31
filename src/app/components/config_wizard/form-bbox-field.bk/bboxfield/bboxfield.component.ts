import { Component, OnInit, forwardRef, Directive } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


export interface WpsBboxValue {
  lllon: number;
  lllat: number;
  urlon: number;
  urlat: number;
}


function validateNumeric(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (isNaN(val)) {
    return {'not numeric': val};
  } else {
    return null;
  }
}

@Component({
  selector: 'ukis-bboxfield',
  templateUrl: './bboxfield.component.html',
  styleUrls: ['./bboxfield.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BboxfieldComponent),
    multi: true
  }]
})
export class BboxfieldComponent implements OnInit, ControlValueAccessor {
  onChangeCallback: any;
  onTouchedCallback: any;
  bboxFormGroup: FormGroup;

  constructor() { }

  ngOnInit() {
    this.bboxFormGroup = new FormGroup({
      lllon: new FormControl(0.0, [Validators.required, validateNumeric]),
      lllat: new FormControl(0.0, [Validators.required, validateNumeric]),
      urlon: new FormControl(0.0, [Validators.required, validateNumeric]),
      urlat: new FormControl(0.0, [Validators.required, validateNumeric])
    });

    this.bboxFormGroup.valueChanges.subscribe(newVals => {
      if (this.onChangeCallback && this.bboxFormGroup.valid) {
        this.onChangeCallback({
          lllon: newVals.lllon,
          lllat: newVals.lllat,
          urlon: newVals.urlon,
          urlat: newVals.urlat,
        });
      }
    });
  }

  writeValue(bbx: WpsBboxValue): void {
    console.log('bbox-value written: ', bbx);
    this.bboxFormGroup.get('lllon').setValue(bbx.lllon);
    this.bboxFormGroup.get('lllat').setValue(bbx.lllat);
    this.bboxFormGroup.get('urlon').setValue(bbx.urlon);
    this.bboxFormGroup.get('urlat').setValue(bbx.urlat);
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.bboxFormGroup.disable();
    } else {
      this.bboxFormGroup.enable();
    }
  }
}
