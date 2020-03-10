import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalProgressComponent } from './global-progress.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';

describe('GlobalProgressComponent', () => {
  let component: GlobalProgressComponent;
  let fixture: ComponentFixture<GlobalProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalProgressComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
