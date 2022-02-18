import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelperButtonsComponent } from './helper-buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/ngrx_register';

describe('SaveButtonComponent', () => {
  let component: HelperButtonsComponent;
  let fixture: ComponentFixture<HelperButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelperButtonsComponent ],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, ClarityModule, StoreModule.forRoot(reducers)]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelperButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
