import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './translate.pipe';
import { SvgComponent } from './components/svg/svg.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { TooltipDirective } from './directives/tooltip.directive';



@NgModule({
  declarations: [
    TranslatePipe,
    SvgComponent,
    TooltipComponent,
    TooltipDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TranslatePipe,
    SvgComponent,
    TooltipDirective,
    TooltipComponent
  ]
})
export class UtilsModule { }
