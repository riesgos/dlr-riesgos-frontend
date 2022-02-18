import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageSwitcherComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
