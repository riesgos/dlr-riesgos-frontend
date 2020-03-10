import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPageComponent } from './wizard-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReadMoreComponent } from '../../read-more/read-more.component';
import { UkisRoutingModule } from 'src/app/app-routing.module';
import { RouteMapComponent } from 'src/app/route-components/route-map/route-map.component';
import { ScenariosComponent } from 'src/app/route-components/scenarios/scenarios.component';

describe('WizardPageComponent', () => {
  let component: WizardPageComponent;
  let fixture: ComponentFixture<WizardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPageComponent, ReadMoreComponent, RouteMapComponent, ScenariosComponent ],
      imports: [TranslateModule.forRoot(), UkisRoutingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
