import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFeatureSelectFieldComponent } from './form-featureselect-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

describe('FormSelectFieldComponent', () => {
  let component: FormFeatureSelectFieldComponent;
  let fixture: ComponentFixture<FormFeatureSelectFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFeatureSelectFieldComponent ],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFeatureSelectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
