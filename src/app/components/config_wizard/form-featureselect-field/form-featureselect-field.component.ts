import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FeatureSelectUconfWD, FeatureSelectUconfWpsData } from '../userconfigurable_wpsdata';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted, InteractionCompleted } from 'src/app/interactions/interactions.actions';

@Component({
  selector: 'ukis-form-featureselect-field',
  templateUrl: './form-featureselect-field.component.html',
  styleUrls: ['./form-featureselect-field.component.css']
})
export class FormFeatureSelectFieldComponent implements OnInit {

  @Input() parameter: FeatureSelectUconfWpsData;
  private options: { [k: string]: any };
  public selectionStrings: string[];
  public activeSelection: string;


  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.options = this.parameter.description.options;
    this.selectionStrings = Object.keys(this.options);
    this.activeSelection = this.parameter.value.id;
  }


  onChange(newValString) {
    const newVal = this.options[newValString];
    this.store.dispatch(new InteractionCompleted({ product: { description: this.parameter.description, value: newVal } }))
  }

  onClick(event) {
    this.store.dispatch(new InteractionStarted({
      mode: "featureselection",
      product: {
        ... this.parameter
      }
    }))
  }

}
