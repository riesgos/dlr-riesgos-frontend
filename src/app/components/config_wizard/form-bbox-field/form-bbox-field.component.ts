import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BboxUconfWD, BboxUconfWpsData } from '../userconfigurable_wpsdata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted, InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'ukis-form-bbox-field',
    templateUrl: './form-bbox-field.component.html',
    styleUrls: ['./form-bbox-field.component.scss']
})
export class FormBboxFieldComponent implements OnInit {

    @Input() parameter: BboxUconfWpsData;
    public formControl: FormControl;
    public disabled: boolean = false;

    constructor(
        private store: Store<State>
    ) {    }
    
    ngOnInit() {
        this.formControl = new FormControl(this.parameter.value || this.parameter.description.defaultValue, [Validators.required]);
        this.formControl.valueChanges.pipe(
            debounceTime(500)
        ).subscribe(newVal => {
            if(this.formControl.valid) {
                if(typeof newVal == "string") {
                    newVal = newVal.split(",").map(v => parseFloat(v));
                }
                this.store.dispatch(new InteractionCompleted({product: {description: this.parameter.description, value: newVal}}))
            }
        })
    }


    onClick(event) {
        this.store.dispatch(new InteractionStarted({
            mode: "bbox", 
            product: {
                description: this.parameter.description, 
                value: this.formControl.value
            }
        }))
    }

}