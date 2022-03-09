import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangedetectorComponent } from './changedetector.component';

describe('ChangedetectorComponent', () => {
  let component: ChangedetectorComponent;
  let fixture: ComponentFixture<ChangedetectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangedetectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
