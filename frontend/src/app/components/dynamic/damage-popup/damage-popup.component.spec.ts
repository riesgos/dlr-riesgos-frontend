import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagePopupComponent } from './damage-popup.component';

describe('DamagePopupComponent', () => {
  let component: DamagePopupComponent;
  let fixture: ComponentFixture<DamagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamagePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
