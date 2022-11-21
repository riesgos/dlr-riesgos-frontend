import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import {  StringSelectUserConfigurableProduct } from '../wizardable_products';
import * as RiesgosActions from 'src/app/riesgos/riesgos.actions';
import { UntypedFormControl } from '@angular/forms';
import { ScenarioName } from 'src/app/riesgos/riesgos.state';

@Component({
    selector: 'ukis-form-stringselect-field',
    templateUrl: './form-stringselect-field.component.html',
    styleUrls: ['./form-stringselect-field.component.scss']
})
export class FormStringselectFieldComponent implements OnInit {

    @Input() control: UntypedFormControl;
    @Input() scenario: ScenarioName;
    @Input() parameter: StringSelectUserConfigurableProduct;
    public options: string[];


    constructor(private store: Store<State>) { }

    ngOnInit() {
        this.options = this.parameter.description.options;
        if (this.control.value === null) {
            this.control.setValue(this.options[0]);
        }
    }


    onChange(newValString) {
        this.store.dispatch(RiesgosActions.userDataProvided({
            scenario: this.scenario,
            products: [{
                ...this.parameter,
                value: newValString
            }]
        }));
    }
}
