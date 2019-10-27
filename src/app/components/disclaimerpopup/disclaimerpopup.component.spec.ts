import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerpopupComponent } from './disclaimerpopup.component';

describe('DisclaimerpopupComponent', () => {
  let component: DisclaimerpopupComponent;
  let fixture: ComponentFixture<DisclaimerpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerpopupComponent ]
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
