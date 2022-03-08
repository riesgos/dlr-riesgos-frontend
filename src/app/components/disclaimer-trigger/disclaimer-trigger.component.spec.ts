import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerTriggerComponent } from './disclaimer-trigger.component';

describe('DisclaimerTriggerComponent', () => {
  let component: DisclaimerTriggerComponent;
  let fixture: ComponentFixture<DisclaimerTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisclaimerTriggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
