import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScalerComponent } from './scaler.component';

describe('ScalerComponent', () => {
  let component: ScalerComponent;
  let fixture: ComponentFixture<ScalerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScalerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
