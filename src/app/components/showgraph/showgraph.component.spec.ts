import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowgraphComponent } from './showgraph.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { GraphvizcompComponent } from '../graphvizcomp/graphvizcomp.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/ngrx_register';

describe('ShowgraphComponent', () => {
  let component: ShowgraphComponent;
  let fixture: ComponentFixture<ShowgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowgraphComponent, GraphvizcompComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule, StoreModule.forRoot(reducers)]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
