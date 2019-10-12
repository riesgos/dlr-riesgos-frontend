import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { FeatureSelectUconfPD, FeatureSelectUconfProduct } from '../userconfigurable_wpsdata';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted, InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { featureCollection } from '@turf/helpers';

@Component({
  selector: 'ukis-form-featureselect-field',
  templateUrl: './form-featureselect-field.component.html',
  styleUrls: ['./form-featureselect-field.component.css']
})
export class FormFeatureSelectFieldComponent implements OnInit {

  @Input() control: FormControl;
  @Input() parameter: FeatureSelectUconfProduct;
  public options: { [k: string]: any };
  // public selectionStrings: string[];
  // public activeSelection: string;


  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.options = this.parameter.description.options;
    this.control.valueChanges.subscribe((newVal: any) => {
      const newValFeatureCollection = featureCollection([newVal]);
      this.store.dispatch(new InteractionCompleted(
        { product: { ...this.parameter,
          value: [newValFeatureCollection]
        }}
      ));
    });
  }


  onClick(event) {
    this.store.dispatch(new InteractionStarted({
      mode: 'featureselection',
      product: { ... this.parameter }
    }));
  }

}
