import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionstatemonitorComponent } from './interactionstatemonitor.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/ngrx_register';

describe('InteractionstatemonitorComponent', () => {
  let component: InteractionstatemonitorComponent;
  let fixture: ComponentFixture<InteractionstatemonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionstatemonitorComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule, StoreModule.forRoot(reducers)]
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
