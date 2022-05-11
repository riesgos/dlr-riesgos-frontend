import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavResizeComponent } from './vertical-nav-resize.component';

describe('VerticalNavResizeComponent', () => {
  let component: VerticalNavResizeComponent;
  let fixture: ComponentFixture<VerticalNavResizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalNavResizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalNavResizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
