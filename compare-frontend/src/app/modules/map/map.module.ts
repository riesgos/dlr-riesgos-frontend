import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { MapService } from './map.service';


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
    MapService
  ]
})
export class MapModule { }
