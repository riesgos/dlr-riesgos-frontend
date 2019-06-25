import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserconfigurableWpsData } from '../userconfigurable_wpsdata';

@Component({
  selector: 'ukis-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  fg: FormGroup;
  @Input() parameters: UserconfigurableWpsData[];
  @Input() disabled: boolean = false;
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    let formControls = {};
    this.parameters.forEach((para: UserconfigurableWpsData) => {
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
