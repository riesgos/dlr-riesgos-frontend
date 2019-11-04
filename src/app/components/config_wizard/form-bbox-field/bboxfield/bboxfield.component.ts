import { Component, OnInit, forwardRef, Directive, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, Validator, NG_VALIDATORS } from '@angular/forms';


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

function properlyFormattedBbox(control: AbstractControl): ValidationErrors | null {
  const val: WpsBboxValue = control.value;
  if (+val.lllon >= +val.urlon) {
    return {'not a bbox': val};
  } else if (+val.lllat >= +val.urlat) {
    return {'not a bbox': val};
  } else {
    return null;
  }
}

function validateRelation(otherControl: AbstractControl, relation): (AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;
    const otherVal = otherControl.value;
    if (relation(val, otherVal)) {
      return null;
    } else {
      return {'bad relation': val};
    }
  };
}


@Component({
  selector: 'ukis-bboxfield',
  templateUrl: './bboxfield.component.html',
  styleUrls: ['./bboxfield.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BboxfieldComponent),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => BboxfieldComponent),
    multi: true,
  } ]
})
export class BboxfieldComponent implements OnInit, ControlValueAccessor, Validator {

  onChangeCallback: any;
  onTouchedCallback: any;
  bboxFormGroup: FormGroup;
  validatorFunction: () => void;

  constructor() { }

  ngOnInit() {
    const lllon = new FormControl(0.0, [Validators.required, validateNumeric]);
    const lllat = new FormControl(0.0, [Validators.required, validateNumeric]);
    const urlon = new FormControl(1.0, [Validators.required, validateNumeric]);
    const urlat = new FormControl(1.0, [Validators.required, validateNumeric]);
    this.bboxFormGroup = new FormGroup({ lllon, lllat, urlon, urlat }, [properlyFormattedBbox]);

    this.bboxFormGroup.valueChanges.subscribe(newVals => {
      if (this.onChangeCallback) {
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

  registerOnValidatorChange?(fn: () => void): void {
    this.validatorFunction = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.bboxFormGroup.disable();
    } else {
      this.bboxFormGroup.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors {
    const val: WpsBboxValue = control.value;
    if (isNaN(val.lllat) || isNaN(val.lllon) || isNaN(val.urlat) || isNaN(val.urlon)) {
      return {'not numeric': val};
    } else if (+val.lllon >= +val.urlon) {
      return {'not a bbox': val};
    } else if (+val.lllat >= +val.urlat) {
      return {'not a bbox': val};
    } else {
      return null;
    }
  }

  onFocus(): void {
    this.onTouchedCallback();
  }
}
