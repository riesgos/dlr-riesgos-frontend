import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationWizardComponent } from './configuration-wizard.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { WizardPageComponent } from '../wizard-page/wizard-page.component';
import { ReadMoreComponent } from '../../read-more/read-more.component';
import { UkisRoutingModule } from 'src/app/app-routing.module';
import { RouteMapComponent } from 'src/app/route-components/route-map/route-map.component';
import { ScenariosComponent } from 'src/app/route-components/scenarios/scenarios.component';

describe('ConfigurationWizardComponent', () => {
  let component: ConfigurationWizardComponent;
  let fixture: ComponentFixture<ConfigurationWizardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationWizardComponent, WizardPageComponent, ReadMoreComponent, RouteMapComponent, ScenariosComponent ],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, ClarityModule, UkisRoutingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
