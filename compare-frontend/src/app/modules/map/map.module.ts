import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { StringPopupComponent } from './popups/string-popup/string-popup.component';
import { BarchartComponent } from './popups/barchart/barchart.component';
import { UtilsModule } from '../utils/utils.module';
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
  ]
})
export class MapModule { }
