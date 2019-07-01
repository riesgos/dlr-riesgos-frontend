import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';


@Directive({
    selector: '[ngVar]',
})
export class VarDirective {
  @Input()
  set ngVar(context: any) {
    console.log("ng-var: new context: ", context, this.vcRef, this.templateRef);
    this.context.$implicit = this.context.ngVar = context;
    this.updateView();
  }

  context: any = {};

  constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}

  updateView() {
    this.vcRef.clear();
    this.vcRef.createEmbeddedView(this.templateRef, this.context);
  }
}