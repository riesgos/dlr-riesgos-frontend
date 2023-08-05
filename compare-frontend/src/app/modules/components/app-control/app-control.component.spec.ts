import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppControlComponent } from './app-control.component';

describe('AppControlComponent', () => {
  let component: AppControlComponent;
  let fixture: ComponentFixture<AppControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
