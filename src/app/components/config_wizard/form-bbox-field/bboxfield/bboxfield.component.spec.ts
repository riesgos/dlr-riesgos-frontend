import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BboxfieldComponent } from './bboxfield.component';

describe('BboxfieldComponent', () => {
  let component: BboxfieldComponent;
  let fixture: ComponentFixture<BboxfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BboxfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BboxfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
