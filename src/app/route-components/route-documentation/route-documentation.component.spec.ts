import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDocumentationComponent } from './route-documentation.component';

describe('RouteDocumentationComponent', () => {
  let component: RouteDocumentationComponent;
  let fixture: ComponentFixture<RouteDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteDocumentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
