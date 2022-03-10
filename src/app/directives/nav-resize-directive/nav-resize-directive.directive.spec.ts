import { NavResizeDirectiveDirective } from './nav-resize-directive.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appNavResize></div>`
})
class TestNavResizeDirectiveDirective { }

describe('NavResizeDirectiveDirective', () => {
  let component: TestNavResizeDirectiveDirective;
  let fixture: ComponentFixture<TestNavResizeDirectiveDirective>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestNavResizeDirectiveDirective, NavResizeDirectiveDirective]
    });
    fixture = TestBed.createComponent(TestNavResizeDirectiveDirective);
    component = fixture.componentInstance;
    element = fixture.debugElement.query(By.css('div'));
  });

  it('should create an instance', () => {
    const directive = NavResizeDirectiveDirective;
    expect(directive).toBeTruthy();
  });
});
