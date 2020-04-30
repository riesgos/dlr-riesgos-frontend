import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpserComponent } from './fpser.component';

describe('FpserComponent', () => {
  let component: FpserComponent;
  let fixture: ComponentFixture<FpserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
