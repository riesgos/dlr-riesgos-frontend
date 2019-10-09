import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BboxUconfPD, BboxUconfProduct } from '../userconfigurable_wpsdata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted, InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { debounceTime } from 'rxjs/operators';
import { WpsBboxValue } from 'projects/services-wps/src/lib/wps_datatypes';

@Component({
    selector: 'ukis-form-bbox-field',
    templateUrl: './form-bbox-field.component.html',
    styleUrls: ['./form-bbox-field.component.scss']
})
export class FormBboxFieldComponent implements OnInit {

    @Input() parameter: BboxUconfProduct;
    public formControl: FormControl;
    public disabled = false;

    constructor(
        private store: Store<State>
    ) {    }

    ngOnInit() {
        const initialBbox: WpsBboxValue = this.parameter.value || this.parameter.description.defaultValue;
        const stringVal = `${initialBbox.lllon}, ${initialBbox.lllat}, ${initialBbox.urlon}, ${initialBbox.urlat}`;
        this.formControl = new FormControl(stringVal, [Validators.required]);
        this.formControl.valueChanges.pipe(
            debounceTime(500)
        ).subscribe(newVal => {
            if (this.formControl.valid) {
                if (typeof newVal === 'string') {
                    newVal = newVal.split(',').map(v => parseFloat(v));
                }
                const bbox: WpsBboxValue = {
                    crs: 'EPSG:4326',
                    lllon: newVal[0],
                    lllat: newVal[1],
                    urlon: newVal[2],
                    urlat: newVal[3],
                }
                this.store.dispatch(new InteractionCompleted(
                    {product: {...this.parameter,
                        value: bbox
                    }}
                ));
            }
        });
    }


    onClick(event) {
        this.store.dispatch(new InteractionStarted({
            mode: 'bbox',
            product: {
                ...this.parameter,
                value: this.formControl.value
            }
        }));
    }

}