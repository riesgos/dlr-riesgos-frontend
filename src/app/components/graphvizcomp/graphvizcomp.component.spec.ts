import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphvizcompComponent } from './graphvizcomp.component';

describe('GraphvizcompComponent', () => {
  let component: GraphvizcompComponent;
  let fixture: ComponentFixture<GraphvizcompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphvizcompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphvizcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
