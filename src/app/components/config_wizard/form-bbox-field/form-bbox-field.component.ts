import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BboxUconfWD } from '../userconfigurable_wpsdata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted, InteractionCompleted } from 'src/app/interactions/interactions.actions';
import { ClrHostWrappingModule } from '@clr/angular/utils/host-wrapping/host-wrapping.module';
import { filter, map, find } from 'rxjs/operators';
import { InteractionState } from 'src/app/interactions/interactions.state';
import { ProductsProvided } from 'src/app/wps/wps.actions';
import { BehaviorSubject, Subject } from 'rxjs';
import { getProducts } from 'src/app/wps/wps.selectors';
import { Product } from 'src/app/wps/wps.datatypes';

@Component({
    selector: 'ukis-form-bbox-field',
    templateUrl: './form-bbox-field.component.html',
    styleUrls: ['./form-bbox-field.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => FormBboxFieldComponent),
    }]
})
export class FormBboxFieldComponent implements OnInit, ControlValueAccessor {

    @Input() parameter: BboxUconfWD;
    @Input() formControl: FormControl;
    public bboxValue: any;
    public disabled: boolean = false;
    private changeFunction;
    private touchFunction; 

    constructor(
        private store: Store<State>
    ) {
    }
    
    ngOnInit() {}

    // called when form submitted
    writeValue(obj: any): void {
        //console.log(`${this.parameter.id} writeValue`, obj);
        this.bboxValue = obj;
    }

    // called when field changed and then clicked elsewhere
    registerOnChange(fn: any): void {
        //console.log(`${this.parameter.id} registering change function `, fn);
        this.changeFunction = fn;
    }
    
    // called when field changed and then clicked elsewhere
    onChange(newVal) {
        //console.log("calling changefunction with ", newVal);
        if(typeof newVal == "string") {
            newVal = newVal.split(",").map(v => parseFloat(v));
        }
        this.changeFunction(newVal);
        this.store.dispatch(new InteractionCompleted({product: {description: this.parameter, value: newVal}}))
    }

    registerOnTouched(fn: any): void {
        this.touchFunction = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        //console.log(`${this.parameter.id} setDisabledState`, isDisabled);
        this.disabled = isDisabled;
    }


    onClick(event) {
        this.store.dispatch(new InteractionStarted({
            mode: "bbox", 
            product: {
                description: this.parameter, 
                value: this.bboxValue
            }
        }))
    }

}