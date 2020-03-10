import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextModalComponent } from './text-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TextModalComponent', () => {
  let component: TextModalComponent;
  let fixture: ComponentFixture<TextModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextModalComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule, BrowserAnimationsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
