import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BboxUconfPD, BboxUconfProduct } from '../userconfigurable_wpsdata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted, InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { debounceTime, map } from 'rxjs/operators';
import { WpsBboxValue } from 'projects/services-wps/src/lib/wps_datatypes';
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
    public stringcontrol: FormControl;
    public disabled = false;

    constructor(
        private store: Store<State>
    ) {
    }

    ngOnInit() {
        const initialBbox: WpsBboxValue = this.parameter.value || this.parameter.description.defaultValue;
        const stringVal = this.bboxToString(initialBbox);
        this.stringcontrol = new FormControl(stringVal, [Validators.required]);
        this.stringcontrol.valueChanges.pipe(
            debounceTime(500)
        ).subscribe((newVal: string) => {
            if (this.stringcontrol.valid) {
                const bbox = this.stringToBbox(newVal);
                this.control.setValue(bbox);
            }
        });

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

    private bboxToString(bbox: WpsBboxValue): string {
        return `${bbox.lllon}, ${bbox.lllat}, ${bbox.urlon}, ${bbox.urlat}`;
    }

    private stringToBbox(bbox: string): WpsBboxValue {
        const array = bbox.split(',').map(v => parseFloat(v));
        const newbbox: WpsBboxValue = {
            crs: 'EPSG:4326',
            lllon: array[0],
            lllat: array[1],
            urlon: array[2],
            urlat: array[3],
        };
        return newbbox;
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