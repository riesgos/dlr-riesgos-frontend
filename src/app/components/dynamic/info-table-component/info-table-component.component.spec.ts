import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTableComponentComponent } from './info-table-component.component';

describe('InfoTableComponentComponent', () => {
  let component: InfoTableComponentComponent;
  let fixture: ComponentFixture<InfoTableComponentComponent>;

  beforeEach(async(() => {
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
