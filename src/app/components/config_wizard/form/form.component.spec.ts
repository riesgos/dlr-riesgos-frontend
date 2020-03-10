import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { FormStringFieldComponent } from '../form-string-field/form-string-field.component';
import { FormBboxFieldComponent } from '../form-bbox-field/form-bbox-field.component';
import { FormStringselectFieldComponent } from '../form-stringselect-field/form-stringselect-field.component';
import { FormFeatureSelectFieldComponent } from '../form-featureselect-field/form-featureselect-field.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponent, FormStringFieldComponent, FormBboxFieldComponent, FormStringselectFieldComponent, FormFeatureSelectFieldComponent ],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
