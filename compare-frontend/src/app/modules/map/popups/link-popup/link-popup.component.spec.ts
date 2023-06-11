import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkPopupComponent } from './link-popup.component';

describe('LinkPopupComponent', () => {
  let component: LinkPopupComponent;
  let fixture: ComponentFixture<LinkPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
