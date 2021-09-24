import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosComponent } from './scenarios.component';
import { TranslateModule } from '@ngx-translate/core';
import { UkisRoutingModule } from 'src/app/app-routing.module';

describe('ScenariosComponent', () => {
  let component: ScenariosComponent;
  let fixture: ComponentFixture<ScenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenariosComponent ],
      imports: [TranslateModule.forRoot(), UkisRoutingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
