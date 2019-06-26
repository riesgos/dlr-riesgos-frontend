import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayercontrolComponent } from './layercontrol.component';

describe('LayercontrolComponent', () => {
  let component: LayercontrolComponent;
  let fixture: ComponentFixture<LayercontrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayercontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayercontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
