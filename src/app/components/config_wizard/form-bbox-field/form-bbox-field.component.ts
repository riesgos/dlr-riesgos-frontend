import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BboxUconfPD, BboxUconfProduct } from '../userconfigurable_wpsdata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted, InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { debounceTime, map } from 'rxjs/operators';
import { WpsBboxValue } from '@dlr-eoc/utils-ogc';
import { Observable } from 'rxjs';
import { InteractionState } from 'src/app/interactions/interactions.state';

@Component({
    selector: 'ukis-form-bbox-field',
    templateUrl: './form-bbox-field.component.html',
    styleUrls: ['./form-bbox-field.component.scss']
})
export class FormBboxFieldComponent implements OnInit {


    public bboxSelectionOngoing$: Observable<boolean>;

    @Input() parameter: BboxUconfProduct;
    @Input() control: FormControl;
    public disabled = false;

    constructor(
        private store: Store<State>
    ) {
    }

    ngOnInit() {
        const initialBbox: WpsBboxValue = this.parameter.value || this.parameter.description.defaultValue;
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
            this.store.dispatch(new InteractionStarted({
                mode: 'bbox',
                product: {
                    ...this.parameter,
                    value: this.control.value
                }
            }));
        } else {
          this.store.dispatch(new InteractionCompleted(
            { product: { ...this.parameter }}
          ));
        }
      }

}
