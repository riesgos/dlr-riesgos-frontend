import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectFeatureComponent } from './form-select-feature.component';

describe('FormSelectFeatureComponent', () => {
  let component: FormSelectFeatureComponent;
  let fixture: ComponentFixture<FormSelectFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSelectFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSelectFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
