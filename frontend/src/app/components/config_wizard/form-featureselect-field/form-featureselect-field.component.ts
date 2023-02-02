import { Component, OnInit, Input } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { FeatureSelectUconfProduct } from '../wizardable_products';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import * as InteractionActions from 'src/app/interactions/interactions.actions';
import { BehaviorSubject } from 'rxjs';
import { ScenarioName } from 'src/app/riesgos/riesgos.state';
import { userDataProvided } from 'src/app/riesgos/riesgos.actions';
import { FeatureCollection } from '@turf/helpers';

@Component({
  selector: 'ukis-form-featureselect-field',
  templateUrl: './form-featureselect-field.component.html',
  styleUrls: ['./form-featureselect-field.component.css']
})
export class FormFeatureSelectFieldComponent implements OnInit {

  // Really, this should be a FormControl<FeatureCollection>, but I don't seem to understand selecting features with <option>'s.
  control: FormControl<string>;
  options: string[];
  @Input() scenario: ScenarioName;
  @Input() parameter: FeatureSelectUconfProduct;
  featureSelectionOngoing$ = new BehaviorSubject<boolean>(false);

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.options = Object.keys(this.parameter.description.featureSelectionOptions);

    let initialValueKey: string;
    if (this.parameter.value) {
      initialValueKey = this.getKeyForValue(this.parameter.value);
    } else if (this.parameter.description.defaultValue) {
      initialValueKey = this.getKeyForValue(this.parameter.description.defaultValue);
    } else {
      initialValueKey = Object.keys(this.parameter.description.featureSelectionOptions)[0];
    }

    this.control = new FormControl<string>(initialValueKey);

    this.control.valueChanges.subscribe(newKey => this.notifyValueChanged(newKey));

    if (!this.parameter.value) {
      this.notifyValueChanged(initialValueKey);
    }

    this.store.select('interactionState').subscribe(state => {
      if (state.mode === 'featureselection') {
        this.featureSelectionOngoing$.next(true);
      }
      else if (state.mode === 'normal' && this.featureSelectionOngoing$.value === true) {
        this.control.setValue(state.product.value);
        this.featureSelectionOngoing$.next(false);
      }
    });
  }

  private notifyValueChanged(newKey: string) {
    const newVal = this.parameter.description.featureSelectionOptions[newKey];
    const newProductVal: FeatureSelectUconfProduct = {
      ... this.parameter,
      value: newVal
    };
    this.store.dispatch(userDataProvided({
      scenario: this.scenario,
      products: [newProductVal]
    }));
  }

  activateFeatureselectInteraction(startInteraction: boolean): void {
    if (startInteraction) {
      this.store.dispatch(InteractionActions.interactionStarted({
        mode: 'featureselection',
        scenario: this.scenario,
        product: { ... this.parameter }
      }));
    } else {
      this.store.dispatch(InteractionActions.interactionCompleted({
        scenario: this.scenario,
        product: { ...this.parameter },
      }));
    }
  }

  getIdForKey(key: string) {
    const featureCollection = this.parameter.description.featureSelectionOptions[key];
    const feature = featureCollection.features[0];
    return feature.id;
  }
  getSelectedId() {
    return this.control.value;
  }
  private getKeyForValue(value: any): string | undefined {
    for (const key of this.options) {
      const selectOption = this.parameter.description.featureSelectionOptions[key];
      if (selectOption.features[0].id === value.features[0].id) {
        return key;
      }
    }
  }

}
