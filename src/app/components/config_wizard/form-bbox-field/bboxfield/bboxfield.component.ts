import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WpsBboxValue } from 'projects/services-wps/src/public-api';

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
  disabled: boolean;
  value: WpsBboxValue;

  constructor() { }

  ngOnInit() {
  }

  writeValue(bbx: WpsBboxValue): void {
    this.value = bbx;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
