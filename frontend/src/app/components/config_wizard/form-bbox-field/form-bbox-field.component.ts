import { Component, OnInit, Input } from '@angular/core';
import { BboxUserConfigurableProduct } from '../wizardable_products';
import { UntypedFormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import * as InteractionActions from 'src/app/interactions/interactions.actions';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InteractionState } from 'src/app/interactions/interactions.state';
import { ScenarioName } from 'src/app/riesgos/riesgos.state';
import { BboxValue } from './bboxfield/bboxfield.component';

@Component({
    selector: 'ukis-form-bbox-field',
    templateUrl: './form-bbox-field.component.html',
    styleUrls: ['./form-bbox-field.component.scss']
})
export class FormBboxFieldComponent implements OnInit {


    public bboxSelectionOngoing$: Observable<boolean>;

    @Input() scenario: ScenarioName;
    @Input() parameter: BboxUserConfigurableProduct;
    @Input() control: UntypedFormControl;
    public disabled = false;

    constructor(
        private store: Store<State>
    ) {
    }

    ngOnInit() {
        const initialBbox: BboxValue = this.parameter.value || this.parameter.description.defaultValue;
        // this.control.setValue(initialBbox);

        this.bboxSelectionOngoing$ = this.store.pipe(
            select('interactionState'),
            map((currentInteractionState: InteractionState) => {
              switch (currentInteractionState.mode) {
                case 'bbox':
                  return true;
                default:
                  return false;
              }
            })
          );
    }

    activateBboxselectInteraction(startInteraction: boolean): void {
        if (startInteraction) {
          const newProductVal = {
            ...this.parameter,
            value: this.control.value
          };
            this.store.dispatch(InteractionActions.interactionStarted({
                mode: 'bbox',
                scenario: this.scenario,
                product: newProductVal
            }));
        } else {
          this.store.dispatch(InteractionActions.interactionCompleted({
            product: { ...this.parameter },
            scenario: this.scenario
          }));
        }
      }

}
