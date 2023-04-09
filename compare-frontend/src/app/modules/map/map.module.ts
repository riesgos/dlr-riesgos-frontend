import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';
import { EqSelection } from './converters/peru/1_eqselect';
import { ConverterService, DefaultConverter, converterToken } from './converter.service';


@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapComponent
  ],
  providers: [
    MapService,
    ConverterService,
    { provide: converterToken, useClass: EqSelection, multi: true },
    { provide: converterToken, useClass: DefaultConverter, multi: true },
  ]
})
export class MapModule { }
