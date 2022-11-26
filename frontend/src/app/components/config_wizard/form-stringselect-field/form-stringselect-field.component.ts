import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import {  StringSelectUserConfigurableProduct } from '../wizardable_products';
import * as RiesgosActions from 'src/app/riesgos/riesgos.actions';
import { FormControl } from '@angular/forms';
import { ScenarioName } from 'src/app/riesgos/riesgos.state';

@Component({
    selector: 'ukis-form-stringselect-field',
    templateUrl: './form-stringselect-field.component.html',
    styleUrls: ['./form-stringselect-field.component.scss']
})
export class FormStringselectFieldComponent implements OnInit {

    control: FormControl<string>;
    @Input() scenario: ScenarioName;
    @Input() parameter: StringSelectUserConfigurableProduct;
    public options: string[];


    constructor(private store: Store<State>) { }

    ngOnInit() {
        this.options = this.parameter.description.options;

        let initivalValue;
        if (this.parameter.value) {
            initivalValue = this.parameter.value;
        } else if (this.parameter.description.defaultValue) {
            initivalValue = this.parameter.description.defaultValue;
        } else {
            initivalValue = this.parameter.description.options[0];
        }

        this.control = new FormControl<string>(initivalValue);

        this.control.valueChanges.subscribe(newVal => this.notifyDataChanged(newVal));

        if (!this.parameter.value) {
            this.notifyDataChanged(initivalValue);
        }
    }

    private notifyDataChanged(newVal: string) {
        this.store.dispatch(RiesgosActions.userDataProvided({
            scenario: this.scenario,
            products: [{
                ...this.parameter,
                value: newVal
            }]
        }));
    }
}
