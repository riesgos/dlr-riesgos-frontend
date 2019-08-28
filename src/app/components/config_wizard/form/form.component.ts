import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserconfigurableProductDescription, UserconfigurableProduct } from '../userconfigurable_wpsdata';

@Component({
  selector: 'ukis-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {


  @Input() parameters: UserconfigurableProduct[];
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit() { }

}
