import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { FeatureSelectUconfProduct } from '../userconfigurable_wpsdata';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { FeatureCollection } from '@turf/helpers';
import * as InteractionActions from 'src/app/interactions/interactions.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InteractionState } from 'src/app/interactions/interactions.state';
import { ScenarioName } from 'src/app/riesgos/riesgos.state';

@Component({
  selector: 'ukis-form-featureselect-field',
  templateUrl: './form-featureselect-field.component.html',
  styleUrls: ['./form-featureselect-field.component.css']
})
export class FormFeatureSelectFieldComponent implements OnInit {

  public featureSelectionOngoing$: Observable<boolean>;

  @Input() control: UntypedFormControl;
  @Input() scenario: ScenarioName;
  @Input() parameter: FeatureSelectUconfProduct;
  public options: { [k: string]: FeatureCollection };

  public stringControl: UntypedFormControl;
  public stringOptions: string[];


  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.options = this.parameter.description.featureSelectionOptions;
    const startValue = this.control.value || this.parameter.description.defaultValue;
    this.stringOptions = Object.keys(this.options);
    const stringStartValue = this.stringOptions.find(s => this.options[s].features[0].id === startValue[0].features[0].id);

    this.stringControl = new UntypedFormControl(stringStartValue, [Validators.required]);

    this.stringControl.valueChanges.subscribe(newStringVal => {
      const newVal = [this.findValForString(newStringVal)];
      this.control.setValue(newVal);
      this.store.dispatch(InteractionActions.interactionCompleted({
        product: {
          ... this.parameter,
          value: newVal
        },
        scenario: this.scenario,
      }));
    });

    this.featureSelectionOngoing$ = this.store.pipe(
      select('interactionState'),
      map((currentInteractionState: InteractionState) => {
        switch (currentInteractionState.mode) {
          case 'featureselection':
            return true;
          default:
            return false;
        }
      })
    );
  }

  private findValForString(key: string): any {
    // return this.options.find(o => key === this.findKeyForVal(o));
    return this.options[key];
  }

  private findKeyForVal(val: FeatureCollection): string {
    return val[0].features[0].id;
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
        product: { ...this.parameter },
        scenario: this.scenario,
      }));
    }
  }

}


function recursiveEqual(obj1: object, obj2: object): boolean {
  for (const key1 in obj1) {
    if (!obj2[key1]) {
      return false;
    }
    else if (typeof obj1[key1] === 'object') {
      const subEqual = recursiveEqual(obj1[key1], obj2[key1]);
      if (!subEqual) {
        return false;
      }
    }
    else if (obj2[key1] !== obj1[key1]) {
      return false;
    }
  }
  return true;
}
