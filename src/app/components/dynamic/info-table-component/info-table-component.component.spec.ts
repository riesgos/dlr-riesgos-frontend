import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoTableComponentComponent } from './info-table-component.component';

describe('InfoTableComponentComponent', () => {
  let component: InfoTableComponentComponent;
  let fixture: ComponentFixture<InfoTableComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoTableComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
