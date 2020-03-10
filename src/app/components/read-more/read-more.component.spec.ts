import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMoreComponent } from './read-more.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';

describe('ReadMoreComponent', () => {
  let component: ReadMoreComponent;
  let fixture: ComponentFixture<ReadMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadMoreComponent ],
      imports: [TranslateModule.forRoot(), ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
