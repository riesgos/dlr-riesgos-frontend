import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';
import { EqSelection } from './converters/eqts/1_eqselect';
import { EqSimulation } from './converters/eqts/2_eqsim';
import { ConverterService, DefaultConverter, converterToken } from './converter.service';
import { StringPopupComponent } from './popups/string-popup/string-popup.component';
import { UtilsModule } from '../utils/utils.module';
import { Exposure } from './converters/eqts/3_exposure';
import { EqDmg } from './converters/eqts/4_eq_dmg';


@NgModule({
  declarations: [
    MapComponent,
    StringPopupComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    MapComponent
  ],
  providers: [
    MapService,
    ConverterService,
    { provide: converterToken, useClass: EqSelection, multi: true },
    { provide: converterToken, useClass: EqSimulation, multi: true },
    { provide: converterToken, useClass: Exposure, multi: true },
    { provide: converterToken, useClass: EqDmg, multi: true },
    { provide: converterToken, useClass: DefaultConverter, multi: true },
  ]
})
export class MapModule { }
