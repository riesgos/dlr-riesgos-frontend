import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowgraphComponent } from './showgraph.component';

describe('ShowgraphComponent', () => {
  let component: ShowgraphComponent;
  let fixture: ComponentFixture<ShowgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
