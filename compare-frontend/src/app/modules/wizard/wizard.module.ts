import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CollapsableComponent } from './collapsable/collapsable.component';
import { TabComponent } from './tabs/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { ConfigComponent } from './wizard/step/config/config.component';
import { LayersComponent } from './wizard/step/layers/layers.component';
import { StepComponent } from './wizard/step/step.component';
import { WizardComponent } from './wizard/wizard.component';
import { WizardService } from './wizard.service';
import { ConverterService, DefaultConverter, converterToken } from './converter.service';
import { EqSelection } from './converters/eqts/1_eqselect';
import { MultiLegendComponent } from './legends/multi-legend/multi-legend.component';
import { LegendComponent } from './legends/legend/legend.component';
import { CircleLegendComponent } from './legends/circle-legend/circle-legend.component';
import { UtilsModule } from '../utils/utils.module';

@NgModule({
  declarations: [
    CollapsableComponent,
    WizardComponent,
    StepComponent,
    ConfigComponent,
    TabsComponent,
    TabComponent,
    LayersComponent,
    MultiLegendComponent,
    LegendComponent,
    CircleLegendComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UtilsModule
  ],
  exports: [
    WizardComponent
  ],
  providers: [
    WizardService,
    ConverterService,
    { provide: converterToken, useClass: EqSelection, multi: true },
    { provide: converterToken, useClass: DefaultConverter, multi: true },
  ]
})
export class WizardModule { }
