import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicDamagePopupComponent } from './economic-damage-popup.component';

describe('EconomicDamagePopupComponent', () => {
  let component: EconomicDamagePopupComponent;
  let fixture: ComponentFixture<EconomicDamagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconomicDamagePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomicDamagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
