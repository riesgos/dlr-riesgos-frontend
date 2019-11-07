import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CesiummapComponent } from './cesiummap.component';

describe('CesiummapComponent', () => {
  let component: CesiummapComponent;
  let fixture: ComponentFixture<CesiummapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CesiummapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CesiummapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
