import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringPopupComponent } from './string-popup.component';

describe('StringPopupComponent', () => {
  let component: StringPopupComponent;
  let fixture: ComponentFixture<StringPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
