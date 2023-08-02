import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLegendComponent } from './image-legend.component';

describe('ImageLegendComponent', () => {
  let component: ImageLegendComponent;
  let fixture: ComponentFixture<ImageLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageLegendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
