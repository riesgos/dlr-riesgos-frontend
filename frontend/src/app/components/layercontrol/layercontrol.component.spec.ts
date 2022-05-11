import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LayercontrolComponent } from './layercontrol.component';
import { ClarityModule } from '@clr/angular';

describe('LayercontrolComponent', () => {
  let component: LayercontrolComponent;
  let fixture: ComponentFixture<LayercontrolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LayercontrolComponent ],
      imports: [ClarityModule]
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
