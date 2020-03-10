import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BboxfieldComponent } from './bboxfield.component';
import { FormComponent } from '../../form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

describe('BboxfieldComponent', () => {
  let component: BboxfieldComponent;
  let fixture: ComponentFixture<BboxfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BboxfieldComponent, FormComponent ],
      imports: [FormsModule, ReactiveFormsModule, ClarityModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BboxfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
