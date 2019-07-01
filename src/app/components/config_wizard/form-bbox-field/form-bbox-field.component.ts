import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BboxUconfWD } from '../userconfigurable_wpsdata';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { InteractionStarted } from 'src/app/interactions/interactions.actions';
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
    public value: BehaviorSubject<any>;
    public disabled: boolean = false;
    private changeFunction;
    private touchFunction; 

    constructor(
        private store: Store<State>
    ) {
        this.value = new BehaviorSubject<any>(null);
    }
    
    ngOnInit() {

        this.value.next(this.parameter.defaultValue);

        this.store.pipe(select(getProducts))
            .pipe(
                map((products: Product[]) => products.find(p => p.description.id == this.parameter.id))
            ).subscribe((product: Product) => {
                this.value.next(product.value)
            })
            
    }

    writeValue(obj: any): void {
        //console.log(`${this.parameter.id} writeValue`, obj);
        this.value.next(obj);
    }

    registerOnChange(fn: any): void {
        //console.log(`${this.parameter.id} registering change function `, fn);
        this.changeFunction = fn;
    }

    registerOnTouched(fn: any): void {
        this.touchFunction = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        //console.log(`${this.parameter.id} setDisabledState`, isDisabled);
        this.disabled = isDisabled;
    }

    onChange(newVal) {
        // console.log("calling changefunction with ", newVal);
        this.changeFunction(newVal);
    }

    onClick(event) {
        this.store.dispatch(new InteractionStarted({
            mode: "bbox", 
            product: {
                description: this.parameter, 
                value: this.value.getValue()
            }
        }))
    }

}