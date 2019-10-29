import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionstatemonitorComponent } from './interactionstatemonitor.component';

describe('InteractionstatemonitorComponent', () => {
  let component: InteractionstatemonitorComponent;
  let fixture: ComponentFixture<InteractionstatemonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionstatemonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionstatemonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
