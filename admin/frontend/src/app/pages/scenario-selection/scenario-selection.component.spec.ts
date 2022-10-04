import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioSelectionComponent } from './scenario-selection.component';

describe('ScenarioSelectionComponent', () => {
  let component: ScenarioSelectionComponent;
  let fixture: ComponentFixture<ScenarioSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenarioSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
