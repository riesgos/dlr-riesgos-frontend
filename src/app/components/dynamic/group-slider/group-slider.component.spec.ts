import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSliderComponent } from './group-slider.component';

describe('GroupSliderComponent', () => {
  let component: GroupSliderComponent;
  let fixture: ComponentFixture<GroupSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
