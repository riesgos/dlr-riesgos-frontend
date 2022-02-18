import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormStringFieldComponent } from './form-string-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/ngrx_register';

describe('FormStringFieldComponent', () => {
  let component: FormStringFieldComponent;
  let fixture: ComponentFixture<FormStringFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStringFieldComponent ],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, ClarityModule, StoreModule.forRoot(reducers)]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStringFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
