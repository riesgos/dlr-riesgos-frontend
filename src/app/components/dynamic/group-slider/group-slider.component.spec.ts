import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupSliderComponent } from './group-slider.component';

describe('GroupSliderComponent', () => {
  let component: GroupSliderComponent;
  let fixture: ComponentFixture<GroupSliderComponent>;

  beforeEach(waitForAsync(() => {
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
