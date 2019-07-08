import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFeatureSelectFieldComponent } from './form-featureselect-field.component';

describe('FormSelectFieldComponent', () => {
  let component: FormFeatureSelectFieldComponent;
  let fixture: ComponentFixture<FormFeatureSelectFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFeatureSelectFieldComponent ]
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
