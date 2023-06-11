import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './translate.pipe';
import { SvgComponent } from './components/svg/svg.component';



@NgModule({
  declarations: [
    TranslatePipe,
    SvgComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TranslatePipe,
    SvgComponent
  ]
})
export class UtilsModule { }
