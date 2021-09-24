import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiesgosLayerControlComponent } from '../layer-control/layer-control.component';

import { LayerentryGroupComponent } from '../layerentry-group/layerentry-group.component';
import { RiesgosLayerentryComponent } from '../layerentry/layerentry.component';

import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
// import { Layer, LayerGroup } from '@dlr-eoc/services-layers';
import { ObjTypePipe } from '../utils/obj-type.pipe';
import { LayersService } from '@dlr-eoc/services-layers';
import { MapStateService } from '@dlr-eoc/services-map-state';
import { ReversePipe } from '../utils/array-reverse.pipe';

describe('LayerControlComponent', () => {
  let component: RiesgosLayerControlComponent;
  let fixture: ComponentFixture<RiesgosLayerControlComponent>;
  let layersSvc: LayersService;
  let mapStateSvc: MapStateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule],
      declarations: [RiesgosLayerControlComponent, LayerentryGroupComponent, RiesgosLayerentryComponent, ObjTypePipe, ReversePipe],
      providers: [LayersService, MapStateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgosLayerControlComponent);
    component = fixture.componentInstance;
    layersSvc = TestBed.inject(LayersService);
    mapStateSvc = TestBed.inject(MapStateService);

    component.layersSvc = layersSvc;
    component.mapStateSvc = mapStateSvc;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input layersSvc', () => {
    expect(component.layersSvc instanceof LayersService).toBeTruthy();
  });

  it('should have input mapStateSvc', () => {
    expect(component.mapStateSvc instanceof MapStateService).toBeTruthy();
  });

  it('should have input layerfilter', () => {
    component.layerfilter = 'Layers';
    expect(component.layerfilter).toBe('Layers');
  });

});
