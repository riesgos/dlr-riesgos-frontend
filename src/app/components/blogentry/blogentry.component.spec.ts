import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogentryComponent } from './blogentry.component';
import { TranslateModule } from '@ngx-translate/core';

describe('BlogentryComponent', () => {
  let component: BlogentryComponent;
  let fixture: ComponentFixture<BlogentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogentryComponent ],
      imports: [TranslateModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
