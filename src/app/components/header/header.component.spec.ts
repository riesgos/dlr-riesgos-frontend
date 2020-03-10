import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ShowgraphComponent } from '../showgraph/showgraph.component';
import { GraphvizcompComponent } from '../graphvizcomp/graphvizcomp.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, DisclaimerComponent, LanguageSwitcherComponent, ShowgraphComponent, GraphvizcompComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
