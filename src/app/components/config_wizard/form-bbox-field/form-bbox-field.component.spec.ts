import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBboxFieldComponent } from './form-bbox-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { BboxfieldComponent } from './bboxfield/bboxfield.component';
import { FormComponent } from '../form/form.component';
import { FormStringFieldComponent } from '../form-string-field/form-string-field.component';

describe('FormBboxFieldComponent', () => {
  let component: FormBboxFieldComponent;
  let fixture: ComponentFixture<FormBboxFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBboxFieldComponent, BboxfieldComponent, FormComponent, FormStringFieldComponent ],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBboxFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
