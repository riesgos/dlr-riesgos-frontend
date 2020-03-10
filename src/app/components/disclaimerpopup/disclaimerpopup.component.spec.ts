import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerpopupComponent } from './disclaimerpopup.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DisclaimerpopupComponent', () => {
  let component: DisclaimerpopupComponent;
  let fixture: ComponentFixture<DisclaimerpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerpopupComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule, BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
