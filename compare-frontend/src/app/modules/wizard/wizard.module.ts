import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CollapsableComponent } from './collapsable/collapsable.component';
import { TabComponent } from './tabs/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { ConfigComponent } from './wizard/step/config/config.component';
import { StepComponent } from './wizard/step/step.component';
import { WizardComponent } from './wizard/wizard.component';
import { WizardService } from './wizard.service';
import { ConverterService, DefaultConverter, converterToken } from './converter.service';
import { EqSelection } from './converters/eqts/1_eqselect';
import { MultiLegendComponent } from './tabComponents/legends/legendComponents/multi-legend/multi-legend.component';
import { LegendComponent } from './tabComponents/legends/legendComponents/legend/legend.component';
import { CircleLegendComponent } from './tabComponents/legends/legendComponents/circle-legend/circle-legend.component';
import { UtilsModule } from '../utils/utils.module';
import { DescriptionComponent } from './tabComponents/description/description.component';
import { DownloadComponent } from './tabComponents/download/download.component';
import { LayersComponent } from './tabComponents/layers/layers.component';
import { LegendsComponent } from './tabComponents/legends/legends.component';
import { ErrorComponent } from './tabComponents/error/error.component';
import { EqSimulation } from './converters/eqts/2_eqsim';

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
    CircleLegendComponent,
    DescriptionComponent,
    DownloadComponent,
    LegendsComponent,
    ErrorComponent
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
    { provide: converterToken, useClass: EqSimulation, multi: true },
    { provide: converterToken, useClass: DefaultConverter, multi: true },
  ]
})
export class WizardModule { }
