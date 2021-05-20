import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteMapComponent } from './route-map.component';
import { TranslateModule } from '@ngx-translate/core';
import { InteractionstatemonitorComponent } from 'src/app/components/interactionstatemonitor/interactionstatemonitor.component';
import { MapComponent } from 'src/app/components/map/map.component';
import { ClarityModule } from '@clr/angular';
import { LayercontrolComponent } from 'src/app/components/layercontrol/layercontrol.component';

describe('RouteMapComponent', () => {
  let component: RouteMapComponent;
  let fixture: ComponentFixture<RouteMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteMapComponent, InteractionstatemonitorComponent, MapComponent, LayercontrolComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
