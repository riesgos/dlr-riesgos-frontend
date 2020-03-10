import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDocumentationComponent } from './route-documentation.component';
import { TranslateModule } from '@ngx-translate/core';
import { BlogentryComponent } from 'src/app/components/blogentry/blogentry.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/ngrx_register';

describe('RouteDocumentationComponent', () => {
  let component: RouteDocumentationComponent;
  let fixture: ComponentFixture<RouteDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteDocumentationComponent, BlogentryComponent ],
      imports: [TranslateModule.forRoot(), StoreModule.forRoot(reducers)]
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
