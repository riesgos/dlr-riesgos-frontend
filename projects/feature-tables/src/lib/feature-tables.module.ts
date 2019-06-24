import { NgModule } from '@angular/core';
import { FeatureTablesComponent } from './feature-tables/feature-tables.component';
import { FeatureTableComponent } from './feature-table/feature-table.component';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [FeatureTablesComponent, FeatureTableComponent],
  imports: [
    CommonModule,
    ClarityModule
  ],
  exports: [FeatureTablesComponent]
})
export class FeatureTablesModule { }
