import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAlertComponent } from './global-alert.component';
import { ClarityModule } from '@clr/angular';

describe('GlobalAlertComponent', () => {
  let component: GlobalAlertComponent;
  let fixture: ComponentFixture<GlobalAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalAlertComponent ],
      imports: [ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
