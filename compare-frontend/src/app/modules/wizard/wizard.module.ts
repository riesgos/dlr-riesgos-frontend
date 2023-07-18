import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapsableComponent } from './collapsable/collapsable.component';
import { TabComponent } from './tabs/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { ConfigComponent } from './wizard/step/config/config.component';
import { StepComponent } from './wizard/step/step.component';
import { WizardComponent } from './wizard/wizard.component';
import { MultiLegendComponent } from './tabComponents/legends/legendComponents/multi-legend/multi-legend.component';
import { LegendComponent } from './tabComponents/legends/legendComponents/legend/legend.component';
import { CircleLegendComponent } from './tabComponents/legends/legendComponents/circle-legend/circle-legend.component';
import { UtilsModule } from '../utils/utils.module';
import { DescriptionComponent } from './tabComponents/description/description.component';
import { LayersComponent } from './tabComponents/layers/layers.component';
import { LegendsComponent } from './tabComponents/legends/legends.component';
import { ErrorComponent } from './tabComponents/error/error.component';
import { LayerComponent } from './tabComponents/layers/layer/layer.component';
import { TranslatedImageComponent } from './tabComponents/legends/translated-image/translated-image.component';
import { TitleComponent } from './wizard/title/title.component';


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
    LegendsComponent,
    ErrorComponent,
    LayerComponent,
    TranslatedImageComponent,
    TitleComponent
  ],
  imports: [
    CommonModule,
    UtilsModule
  ],
  exports: [
    WizardComponent
  ],
  providers: [
  ]
})
export class WizardModule { }
