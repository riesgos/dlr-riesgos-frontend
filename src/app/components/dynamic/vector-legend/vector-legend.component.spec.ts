import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VectorLegendComponent } from './vector-legend.component';

describe('VectorLegendComponent', () => {
  let component: VectorLegendComponent;
  let fixture: ComponentFixture<VectorLegendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VectorLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VectorLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
