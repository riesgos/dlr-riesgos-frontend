import { NgModule } from '@angular/core';
import { FormComponent } from './form/form.component';
import { FormBboxFieldComponent } from './form-bbox-field/form-bbox-field.component';
import { FormSelectFieldComponent } from './form-select-field/form-select-field.component';
import { FormStringFieldComponent } from './form-string-field/form-string-field.component';
import { FormSelectFeatureComponent } from './form-select-feature/form-select-feature.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { MapOlModule } from '@ukis/map-ol';

@NgModule({
  declarations: [
    FormStringFieldComponent,
    FormSelectFieldComponent, 
    FormBboxFieldComponent,
    FormComponent,
    FormSelectFeatureComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    MapOlModule
  ],
  exports: [FormComponent]
})
export class DynformsModule { }
