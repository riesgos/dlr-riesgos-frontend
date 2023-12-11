import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncBarchartComponent } from './async-barchart.component';

describe('AsyncBarchartComponent', () => {
  let component: AsyncBarchartComponent;
  let fixture: ComponentFixture<AsyncBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsyncBarchartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsyncBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
