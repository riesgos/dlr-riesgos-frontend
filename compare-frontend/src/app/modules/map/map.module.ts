import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';
import { EqSelection } from './converters/eqts/1_eqselect';
import { EqSimulation } from './converters/eqts/2_eqsim';
import { ConverterService, DefaultConverter, converterToken } from './converter.service';
import { StringPopupComponent } from './popups/string-popup/string-popup.component';
import { BarchartComponent } from './popups/barchart/barchart.component';
import { UtilsModule } from '../utils/utils.module';
import { Exposure } from './converters/eqts/3_exposure';
import { EqDmg } from './converters/eqts/4_eq_dmg';
import { TsSim } from './converters/eqts/5_tssim';
import { GroupedBarChartComponent } from './popups/grouped-bar-chart/grouped-bar-chart.component';
import { DamagePopupComponent } from './popups/damage-popup/damage-popup.component';
import { LinkPopupComponent } from './popups/link-popup/link-popup.component';


@NgModule({
  declarations: [
    MapComponent,
    StringPopupComponent,
    BarchartComponent,
    GroupedBarChartComponent,
    DamagePopupComponent,
    LinkPopupComponent
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
    { provide: converterToken, useClass: TsSim, multi: true },
    { provide: converterToken, useClass: DefaultConverter, multi: true },
  ]
})
export class MapModule { }
