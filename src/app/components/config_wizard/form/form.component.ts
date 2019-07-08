import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserconfigurableWpsDataDescription, UserconfigurableWpsData } from '../userconfigurable_wpsdata';

@Component({
  selector: 'ukis-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {


  @Input() parameters: UserconfigurableWpsData[];
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit() { }

}
