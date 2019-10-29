import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FeatureSelectUconfProduct } from '../userconfigurable_wpsdata';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { FeatureCollection } from '@turf/helpers';
import { InteractionCompleted, InteractionStarted } from 'src/app/interactions/interactions.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InteractionState } from 'src/app/interactions/interactions.state';

@Component({
  selector: 'ukis-form-featureselect-field',
  templateUrl: './form-featureselect-field.component.html',
  styleUrls: ['./form-featureselect-field.component.css']
})
export class FormFeatureSelectFieldComponent implements OnInit {

  public featureSelectionOngoing$: Observable<boolean>;

  @Input() control: FormControl;
  @Input() parameter: FeatureSelectUconfProduct;
  public options: { [k: string]: FeatureCollection };

  public stringControl: FormControl;
  public stringOptions: string[];


  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.options = this.parameter.description.options;
    const startValue = this.control.value || this.parameter.description.defaultValue;

    this.stringOptions = Object.keys(this.options);
    const stringStartValue = startValue[0].features[0].id;
    this.stringControl = new FormControl(stringStartValue, [Validators.required]);

    this.stringControl.valueChanges.subscribe(newStringVal => {
      const newVal = [this.findValForString(newStringVal)];
      this.control.setValue(newVal);
      this.store.dispatch(new InteractionCompleted({product: {
        ... this.parameter,
        value: newVal
      }}));
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
      this.store.dispatch(new InteractionStarted({
        mode: 'featureselection',
        product: { ... this.parameter }
      }));
    } else {
      this.store.dispatch(new InteractionCompleted(
        { product: { ...this.parameter }}
      ));
    }
  }

}
