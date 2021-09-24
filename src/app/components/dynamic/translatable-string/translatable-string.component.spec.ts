import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatableStringComponent } from './translatable-string.component';

describe('TranslatableStringComponent', () => {
  let component: TranslatableStringComponent;
  let fixture: ComponentFixture<TranslatableStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslatableStringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatableStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
