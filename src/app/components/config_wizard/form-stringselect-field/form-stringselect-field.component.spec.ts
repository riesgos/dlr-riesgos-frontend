import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStringselectFieldComponent } from './form-stringselect-field.component';

describe('FormStringselectFieldComponent', () => {
  let component: FormStringselectFieldComponent;
  let fixture: ComponentFixture<FormStringselectFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStringselectFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStringselectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
