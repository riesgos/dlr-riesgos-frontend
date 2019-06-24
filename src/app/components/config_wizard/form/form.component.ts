import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserconfigurableWpsDataDescription } from '../userconfigurable_wpsdata';

@Component({
  selector: 'ukis-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  fg: FormGroup;
  @Input() parameters: UserconfigurableWpsDataDescription[];
  @Input() disabled: boolean = false;
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    let formControls = {};
    this.parameters.forEach((para: UserconfigurableWpsDataDescription) => {
      let fc = new FormControl(para.defaultValue);
      formControls[para.id] = fc;
    });
    this.fg = new FormGroup(formControls);

    if(this.disabled === true) this.fg.disable();
    else this.fg.enable();
  }

  onSubmit() {
    this.formSubmitted.emit(this.fg.value);
  }

}
